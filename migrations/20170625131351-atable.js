'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('crashtest', {
    id: {
      type: type.BIG_INTEGER,
      notNull: true,
      primaryKey: true
    },
    date: {
      type: type.DATE,
      notNull: true,
      primaryKey: true
    },
    data: {
      type: type.TEXT,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('test', {
    ifExists: true
  });
};

exports._meta = {
  "version": 1
};
