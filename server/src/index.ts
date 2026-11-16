import { APP_NAME } from "@health-tracker/shared";
import { createApp } from "./app.ts";

const port = Number(process.env.PORT ?? 3001);

createApp().listen(port, () => {
  console.log(`${APP_NAME} API listening on http://localhost:${port}`);
});
