import express from 'express';
import 'dotenv/config.js';

import { setRoutes } from './src/routes.js';
import { logger } from './src/utils/logger.js';

const port = process.env.PORT || 3001;
const app = express();
setRoutes(app);

app.listen(port, () => {
  logger.info(`listening on ${port}`);
});
