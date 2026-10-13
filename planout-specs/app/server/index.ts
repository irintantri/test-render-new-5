/** Server entrypoint: loads env, builds the app, listens on PORT. */
import { loadEnv } from "./env";
loadEnv();

import { isAiConfigured } from "@shared/ai";
import { createApp } from "./app";

const PORT = Number(process.env.PORT) || 3001;
const USE_MOCK_DB = (process.env.USE_MOCK_DB ?? "true") !== "false";
const app = createApp({ useMockDb: USE_MOCK_DB });

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Mock DB: ${USE_MOCK_DB}`);
  console.log(`[server] AI provider: ${isAiConfigured() ? "OpenRouter" : "local mock (set OPENROUTER_API_KEY to enable)"}`);
});

export default app;
