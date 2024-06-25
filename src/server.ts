import { config } from 'dotenv';
config();
import { registerRoutes } from '../routes';
import { FastifyWrapper } from '../_wrapper';

const app = new FastifyWrapper();
registerRoutes(app);

app.run(Number(process.env.PORT) || 8080);
