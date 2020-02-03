import nano from 'nano';
import { Molecule, StashedMolecule, User, Token } from './entities';
import TokenDatabase from './TokenDatabase';
import MoleculeDatabase from './MoleculeDatabase';
import UserDatabase from './UserDatabase';

export class CouchDatabase<T> {
  constructor(protected collection: nano.DocumentScope<T>) {}

  get db() {
    return this.collection;
  }
}

interface Databases {
  molecule: MoleculeDatabase;
  stashed: CouchDatabase<StashedMolecule>;
  user: UserDatabase;
  token: TokenDatabase;
}

export default class CouchHelper {
  // @ts-ignore
  public link: nano.ServerScope;
  // @ts-ignore
  protected dbs: Databases;

  protected static readonly MOLECULE_COLLECTION = "molecule";
  protected static readonly STASHED_MOLECULE_COLLECTION = "stashed";
  protected static readonly USER_COLLECTION = "user";
  protected static readonly TOKEN_COLLECTION = "token";
  protected static readonly DBS = [
    "molecule",
    "stashed",
    "user",
    "token"
  ];

  constructor(url: string) {
    this.refresh(url);
  }

  /**
   * Link the given url to collections.
   */
  protected refresh(url: string) {
    this.link = nano(url);

    this.dbs = {
      molecule: new MoleculeDatabase(this.link.use(CouchHelper.MOLECULE_COLLECTION)),
      stashed: new CouchDatabase<StashedMolecule>(this.link.use(CouchHelper.STASHED_MOLECULE_COLLECTION)),
      user: new UserDatabase(this.link.use(CouchHelper.USER_COLLECTION)),
      token: new TokenDatabase(this.link.use(CouchHelper.TOKEN_COLLECTION)),
    };
  }

  get molecule() {
    return this.dbs.molecule;
  }

  get token() {
    return this.dbs.token;
  }

  get user() {
    return this.dbs.user;
  }

  get stashed() {
    return this.dbs.stashed;
  }

  /** Create a database */
  create(name: string) {
    return this.link.db.create(name);
  }

  async createAll() {
    for (const db of CouchHelper.DBS) {
      await this.create(db);
    }
  }

  /** Delete a database */
  delete(name: string) {
    return this.link.db.destroy(name).catch(e => e);
  }

  async deleteAll() {
    for (const db of CouchHelper.DBS) {
      await this.delete(db);
    }
  }

  /** Wipe all databases and recreate them all */
  async wipeAndCreate() {
    await this.deleteAll();
    await this.createAll();
  }
}

export const COUCH_HELPER = new CouchHelper("http://localhost:5984/martinize");
