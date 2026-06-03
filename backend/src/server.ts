import "./patch-prisma-pkg.js";
import { createApp } from "./app.js";
import { initializeDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function main() {
  await initializeDatabase();

  const app = createApp();

  const host = process.env.HOST ?? "127.0.0.1";

  app.listen(env.port, host, () => {
    console.log(`Server running on http://${host}:${env.port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
