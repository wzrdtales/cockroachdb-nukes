var pg = require('pg'),
      DBMigrate = require('db-migrate');

var dbm = DBMigrate.getInstance(true);

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}



dbm.up()
.then(() => {

  let config = dbm.config.getCurrent().settings;
  console.log(config)

  let connection = new pg.Client(config);
  connection.connect();

  let query = 'INSERT INTO crashtest (id, date, data) VALUES ';
  let args = [];
  let params = [];

  for(let i = 1; i < Math.pow(2, 17); ++i) {
    args.push(`($${i}, $${++i}, $${++i})`);
    params.push(i);
    params.push(randomDate(new Date(1970, 0, 1), new Date()));
    params.push('something');
  }

  query += args.join(', ');

  console.log('nukedinuke');

  connection.query(query, params, function(err, data) {

    console.log('and it shall be dead.', err);
    process.exit(0);
  });

});
