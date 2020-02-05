import express from 'express';
import commander from 'commander';
import { VERSION } from './constants';
import logger, { FORMAT_FILE } from './logger';
import Winston from 'winston';
import ApiRouter from './routes';
import CliHelper from 'interactive-cli-helper';
import Errors, { ErrorType, ApiError } from './Errors';
import { sendError } from './helpers';
import CouchHelper, { Database } from './Entities/CouchHelper';
import MoleculeOrganizer from './MoleculeOrganizer';
import { Molecule } from './Entities/entities';
import MOLECULE_CLI from './cli/molecule_cli';

commander
  .version(VERSION)
  .option('-c, --couchdb-url <url>', 'Couch DB URL', String, 'http://localhost:5984')
  .option('-p, --port <port>', 'Emit port', Number, 4123)
  .option('--wipe-init')
  .option('--init-db')
  .option('-l, --log-level <logLevel>', 'Log level [debug|silly|verbose|info|warn|error]', /^(debug|silly|verbose|info|warn|error)$/, 'info')
  .option('--file-log-level <logLevel>', 'Log level (written to file) [debug|silly|verbose|info|warn|error]', /^(debug|silly|verbose|info|warn|error)$/, 'info')
  .option('--log-file <logFile>', 'File log level')
.parse(process.argv);

const app = express();

// Parse CLI args
if (commander.logLevel) {
  logger.level = commander.logLevel;
}

if (commander.logFile) {
  logger.add(new Winston.transports.File({ 
      filename: commander.logFile, 
      level: commander.fileLogLevel, 
      eol: "\n", 
      format: FORMAT_FILE 
  }));
}

if (commander.couchdbUrl) {
  Database.refresh(commander.couchdbUrl);
}

if (commander.wipeInit) {
  logger.info("Wiping databases and creating them again");
  Database.wipeAndCreate();
}

if (commander.initDb) {
  logger.info("Creating all databases");
  Database.createAll();
}

// Register API router
app.use('/api', ApiRouter);

// Catch API errors
app.use('/api', (err: any, req: express.Request, res: express.Response, next: Function) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err.name === 'UnauthorizedError') {
    logger.debug("Token identification error: " + err.name);
    Errors.send(ErrorType.TokenInvalid, res);
  }
  else if (err instanceof ApiError) {
    sendError(err, res);
  }
  // @ts-ignore
  else if (req.field) {
    // @ts-ignore
    Errors.send(ErrorType.Format, res, { field: req.field });
  }
  else {
    next(err);
  }
});

function startCli() {
  // Cli starter
  const CLI = new CliHelper("Command not found.");

  CLI.addSubListener('exit', () => {
    CLI.onclose!();
    process.exit(0);
  });

  CLI.addSubListener('molecule', MOLECULE_CLI);
  

  CLI.listen();
}

async function main() {
  await Database.ping();

  app.listen(commander.port, () => {
    logger.info(`Martinize Database Server version ${VERSION} is listening on port ${commander.port}.`);
    startCli();
  });
}

main();
