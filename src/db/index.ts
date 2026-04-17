import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

type DB = ReturnType<typeof createDatabase<typeof schema>>;
let _db: DB | undefined;

export const db = new Proxy({} as DB, {
  get(_, prop: string | symbol) {
    if (!_db) {
      _db = createDatabase(schema);
    }
    const target = _db[prop as keyof DB];
    return typeof target === "function" ? target.bind(_db) : target;
  },
});

export * from "./schema";
