"use strict";

exports.migrate = db => {
  return db.createTable("mytable", {
    key1: {
      type: "BIGINT",
      notNull: true,
      primaryKey: true
    },
    key2: {
      type: "BIGINT",
      notNull: true,
      primaryKey: true
    },
    value: {
      type: "BIGINT",
      notNull: true
    },
    createdAt: {
      type: "TIMESTAMPTZ",
      defaultValue: {
        raw: "CURRENT_TIMESTAMP()"
      },
      notNull: true
    },
    updatedAt: {
      type: "TIMESTAMPTZ",
      defaultValue: {
        special: "CURRENT_TIMESTAMP"
      },
      notNull: true
    }
  });
};

exports._meta = {
  version: 2
};
