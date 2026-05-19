use std::io::{Read, Write};
use std::net::TcpStream;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::{Manager, RunEvent};
use tauri_plugin_shell::process::CommandChild;
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::ShellExt;

const API_PORT: u16 = 3001;

struct BackendState {
    child: Mutex<Option<CommandChild>>,
}

fn health_ok() -> bool {
    let Ok(mut stream) = TcpStream::connect(("127.0.0.1", API_PORT)) else {
        return false;
    };

    let _ = stream.set_read_timeout(Some(Duration::from_secs(2)));
    let request =
        "GET /health HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n";

    if stream.write_all(request.as_bytes()).is_err() {
        return false;
    }

    let mut response = String::new();
    if stream.read_to_string(&mut response).is_err() {
        return false;
    }

    response.contains("200") && response.contains("\"ok\"")
}

fn wait_for_backend() {
    let deadline = Instant::now() + Duration::from_secs(90);
    while Instant::now() < deadline {
        if health_ok() {
            return;
        }
        std::thread::sleep(Duration::from_millis(250));
    }
    panic!("Backend failed to start within 90 seconds");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let state = BackendState {
                child: Mutex::new(None),
            };

            #[cfg(not(debug_assertions))]
            {
                let sidecar = app.shell().sidecar("job-tracker-api")?;
                let (mut _rx, child) = sidecar
                    .env("PORT", API_PORT.to_string())
                    .env("SERVE_FRONTEND", "true")
                    .env("NODE_ENV", "production")
                    .spawn()?;

                *state.child.lock().unwrap() = Some(child);
            }

            app.manage(state);
            wait_for_backend();
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app_handle, event| {
            if let RunEvent::Exit = event {
                if let Some(state) = app_handle.try_state::<BackendState>() {
                    if let Some(child) = state.child.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
            }
        });
}
