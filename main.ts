// server/main.ts
import { registerRoutes } from "./routes";
import { FastifyWrapper } from "./_wrapper";
import "./app/config/env";

const app = new FastifyWrapper();
registerRoutes(app);
app.run(Number(process.env.PORT) || 8080);
