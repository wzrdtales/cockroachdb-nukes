const crdb = require("crdb-pg");
const DBMigrate = require("db-migrate");
const { default: SQL } = require("sql-template-tag");

const CRDB = require("crdb-pg");

var dbm = DBMigrate.getInstance(true);

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

dbm.up().then(async () => {
  let config = dbm.config.getCurrent().settings;
  const crdb = new CRDB(config);
  const pool = crdb.pool();

  console.log(config);
  let key1 = 1;
  let key2 = 1;
  let success = true;

  console.log("insert value with duplicate key(1,1)");

  await pool.query(
    SQL`INSERT INTO "mytable" (key1, key2, value)
    VALUES (${key1}, ${key2}, 1)`
  );

  console.log(
    "generating bulk query conflict on duplicate key(1,1) with value in db"
  );

  await pool
    .query(
      SQL`INSERT INTO "mytable" (key1, key2, value)
    VALUES (${key1}, ${key2}, 3), (${key1}, ${key2}, 2)
    ON CONFLICT DO NOTHING`
    )
    .catch(err => {
      console.log("bulk query with value in db errored!", err);
      success = false;
    });

  if (success) console.log("successfully inserted!");
  else console.error("error see above!");

  console.log(
    "generating bulk query conflict on duplicate key(2,1) without value in db"
  );

  key1 = 2;

  success = true;

  await pool
    .query(
      SQL`INSERT INTO "mytable" (key1, key2, value)
    VALUES (${key1}, ${key2}, 3), (${key1}, ${key2}, 2)
    ON CONFLICT DO NOTHING`
    )
    .catch(err => {
      console.log("bulk query without value in db errored!", err);
      success = false;
    });

  if (success) console.log("successfully inserted!");
  else console.error("error see above!");

  await dbm.reset();
});
