import Database from "better-sqlite3";
import * as sqliteVec from "sqlite-vec";
import path from "path";

const db = new Database(
  path.join(process.cwd(), "data", "verses.db"),
  { readonly: true }
);

sqliteVec.load(db);

export default db;
