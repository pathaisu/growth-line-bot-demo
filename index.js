import express from 'express';
import 'dotenv/config.js';
import { setRoutes } from './src/routes.js';


const port = process.env.PORT || 3001;
const app = express();
setRoutes(app);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
