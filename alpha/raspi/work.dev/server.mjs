import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url) );

const logger = {
  info : function(msg) {
    console.log(msg);
  }
};

const config = {
  port: 8000,
  publicDir: resolve(__dirname, '../work/py/public')
};

const app = express();
app.use(express.static(config.publicDir) );

app.listen(config.port, () => {
  logger.info(`http server started at port ${config.port}`);
});
