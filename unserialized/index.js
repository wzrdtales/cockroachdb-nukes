var CRDB = require("crdb-pg"),
  DBMigrate = require("db-migrate");

const SQL = require("sql-template-strings");

var dbm = DBMigrate.getInstance(true);

dbm.up().then(async () => {
  let config = dbm.config.getCurrent().settings;
  console.log(config);

  const crdb = new CRDB(config);
  const pool = crdb.pool();
  let work = [];

  await pool.query(SQL`UPSERT INTO nonce (id, nonce) VALUES (0, 1)`);
  for (let i = 0; i < 5; ++i) {
    work.push(
      pool.retry(async client => {
        console.log("start", i);
        const {
          rows: [nonce]
        } = await client.query(SQL`SELECT "nonce" FROM "nonce" WHERE "id" = 0`);

        await client.query(
          SQL`UPDATE "nonce" SET "nonce" = "nonce" + 1 WHERE "id" = 0`
        );
        console.log(i, "survived here with nonce", nonce.nonce);

        return {};
      })
    );
  }

  await Promise.all(work);

  process.exit(0);
});
