use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::path::BaseDirectory;
use tauri::{Manager, RunEvent};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
#[cfg(not(debug_assertions))]
use tauri_plugin_shell::ShellExt;

const API_PORT: u16 = 3001;

struct BackendState {
    child: Mutex<Option<CommandChild>>,
}

fn log_file_path() -> PathBuf {
    let base = std::env::var("APPDATA")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("."));
    let dir = base.join("JobApplicationTracker");
    let _ = std::fs::create_dir_all(&dir);
    dir.join("app.log")
}

fn append_log(line: &str) {
    if let Ok(mut file) = OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_file_path())
    {
        let _ = writeln!(file, "{line}");
    }
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
    append_log("Backend failed to start within 90 seconds");
    panic!("Backend failed to start within 90 seconds — see {:?}", log_file_path());
}

fn spawn_log_reader(mut rx: tauri::async_runtime::Receiver<CommandEvent>) {
    std::thread::spawn(move || {
        tauri::async_runtime::block_on(async move {
            while let Some(event) = rx.recv().await {
                match event {
                    CommandEvent::Stdout(bytes) => {
                        append_log(&format!("[api] {}", String::from_utf8_lossy(&bytes).trim()));
                    }
                    CommandEvent::Stderr(bytes) => {
                        append_log(&format!("[api] {}", String::from_utf8_lossy(&bytes).trim()));
                    }
                    CommandEvent::Error(err) => {
                        append_log(&format!("[api error] {err}"));
                    }
                    CommandEvent::Terminated(payload) => {
                        append_log(&format!("[api exited] code={:?}", payload.code));
                    }
                    _ => {}
                }
            }
        });
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            append_log("Starting desktop app");

            let state = BackendState {
                child: Mutex::new(None),
            };

            #[cfg(not(debug_assertions))]
            {
                let mut command = app.shell().sidecar("job-tracker-api")?;
                command = command
                    .env("PORT", API_PORT.to_string())
                    .env("SERVE_FRONTEND", "true")
                    .env("NODE_ENV", "production");

                if let Ok(sidecar_root) =
                    app.path()
                        .resolve("bundle-resources", BaseDirectory::Resource)
                {
                    append_log(&format!("SIDECAR_ROOT={}", sidecar_root.display()));
                    command = command.env("SIDECAR_ROOT", sidecar_root);
                } else {
                    append_log("bundle-resources not found in app resources");
                }

                let (rx, child) = command.spawn()?;
                spawn_log_reader(rx);
                *state.child.lock().unwrap() = Some(child);
            }

            app.manage(state);
            wait_for_backend();
            append_log("Backend is ready");
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
