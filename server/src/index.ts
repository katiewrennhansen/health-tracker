import { createApp } from "./app.ts";
import { config } from "./config.ts";

const port = Number(config.PORT ?? 3001);

createApp().listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
