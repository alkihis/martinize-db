import fs from 'fs';
import logger from './logger';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';

const json_package = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf-8'));
export const VERSION = json_package.version as string;

/**
 * OpenSSL's SSH RSA keys used to make/decode JSON Web Tokens (JWT)
 */
let KEYS: { PUBLIC: string, PRIVATE: string };
try {
  KEYS = {
    PUBLIC: fs.readFileSync(__dirname + "/../.keys/key_new", "utf-8"),
    PRIVATE: fs.readFileSync(__dirname + "/../.keys/key_new.pem", "utf-8"),
  };
} catch (e) {
  logger.log("fatal", "It seems you didn't properly set the RSA keys, the server can't run. Check the documentation.");
  process.exit(0);
}

export { KEYS };

/* - DEFAULT DIRECTORIES - */
export const MOLECULE_ROOT_DIR = path.resolve(__dirname, "../molecules/") + "/";
export const MARTINIZER_ROOT_DIR = path.resolve(__dirname, "../molecules/martinizer/") + "/";
export const UPLOAD_ROOT_DIR = path.resolve(__dirname, "../uploads/") + "/";
export const LIPIDS_ROOT_DIR =path.resolve(__dirname, "../lipids/") + "/";
export const SETTINGS_FILE = path.resolve(__dirname, "../settings.json");
export const TEMPLATE_DIR = path.resolve(__dirname, "../templates/") + "/";
export const FORCE_FIELD_DIR = path.resolve(__dirname, "../force_fields") + "/";
export const DEFAULT_TMP_BASE_DIR = "/data/dev/mad/tmp/";


/* - Job manager - */
export type JobMethod = 'jm' | 'child';
export const DEFAULT_JOB_METHOD: JobMethod = 'child';

/* - SEARCH WORKERS SETTINGS - */
export const MINUTES_BEFORE_WORKER_KILL = 2;
export const MAX_POOL_SIZE = 10;
export const MAX_REQUEST_PER_WORKER_THRESHOLD = 3;

/** If `true`, every sended molecule to `/api/molecule/create` will be directly accepted without moderation. */
export const DISABLE_MODERATION_PROCESS = false;

/** Name of the e-mail sender. */
export const DEFAULT_MAILER_NAME = "MArtini Database";
/** E-mail address of the mail sender. */
export const DEFAULT_MAILER_ADDRESS = "martinize.db@ibcp.fr";
/** Debug purpose only; If `string`, all e-mails will be sent to the following address. */
export const MAILER_ENFORCE_RECIPIENT: false | string = "tulouca@gmail.com";
/** Default parameters for Mailer. See `nodemailer` package documentation. */
export const MAILER_TRANSPORT_SETTINGS: SMTPTransport.Options = {
  host: 'smtp.ibcp.fr',
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
};
/** Default parameters for Mailer. See `ms-jobmanager` package documentation. */
export const JOB_MANAGER_SETTINGS = {
  address: '127.0.0.1',
  port: 2345
};

/* - Martinizer constants - */
/** DSSP Path. For now, due to a bug in Martinize2, it's optional. */
export const DSSP_PATH = "/Users/alki/opt/anaconda3/bin/mkdssp";
/** Link to script used to create go virtual sites launcher. */
export const CREATE_GO_PATH = path.resolve(__dirname, "../utils/create_go_virt.sh");
/** Link to script used to create go virtual sites. */
export const CREATE_GO_PY_SCRIPT_PATH = path.resolve(__dirname, "../utils/create_goVirt.py");
/** Link to script that can start ccmap */
export const CREATE_MAP_PATH = path.resolve(__dirname, "../utils/get_map.sh");
/** Associated python script to ccmap */
export const CREATE_MAP_PY_SCRIPT_PATH = path.resolve(__dirname, "../utils/get_map.py");
/** Link to script that can run GROMACS */
export const CONECT_PDB_PATH = path.resolve(__dirname, "../utils/create_conect_pdb.sh");
export const CONECT_PDB_PATH_JM = path.resolve(__dirname, "../utils/create_conect_pdb_coreScript.sh");
/** Link to MDP file needed for GROMACS's grompp */
export const CONECT_MDP_PATH = path.resolve(__dirname, "../utils/run.mdp");
/** Link to Python 3 binary */
export const PYTHON_3_PATH = "python";
/** Path to script that starts martinize2 */
export const MARTINIZE_PATH = path.resolve(__dirname, "../utils/martinize.sh");

/* - Membrane builder constants - */
/** Full path to insane start script */
export const INSANE_PATH = path.resolve(__dirname, "../utils/insane.sh");

/**
 * Default URLs.
 * - `SERVER` is the public URL of the server. Don't forget to set it in order to have working URLs in e-mails !
 * - `COUCH` is default CouchDB URL. Usually, this URL is not used, the `--couchdb-url` parameter of server is used instead.
 */
export const URLS = {
<<<<<<< HEAD
  SERVER: "mad-dev.ibcp.fr:", //3003
  COUCH: "http://mad_agent:mad_agent@arwen-cdb.ibcp.fr:5984",
=======
  SERVER: "http://mad-dev.ibcp.fr",
  COUCH: "http://localhost:5984",
>>>>>>> 60e098d88e043424627ad5b4423f4a0855d59705
};

/* - Regular expressions used to check recieved parameters - */
export const USERNAME_REGEX = /^[a-z][a-z0-9_-]*[a-z0-9]$/i;
export const EMAIL_REGEX = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
