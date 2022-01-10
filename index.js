const fs = require('fs');
const pg = require('pg');

const pool = new (pg.native ?? pg).Pool({
  user:     process.env.POSTGRES_USER,
  host:     process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  port:     process.env.POSTGRES_PORT || 5432,
  password: process.env.POSTGRES_PASSWORD || fs.readFileSync('/run/secrets/POSTGRES_PASSWORD_FILE').toString().trim(),
  schema:   process.env.POSTGRES_SCHEMA,
  ssl:      parseInt(process.env.POSTGRES_SSL) === 1 ? {
    rejectUnauthorized: true, ca: fs.readFileSync('/run/secrets/POSTGRES_CA').toString(),
  } : null
});

const query    = (sql, params) => pool.query(sql, params);
const client   = () => pool.connect();
const arrayArg = (arr, startIndex = 1) => {
  return arr.map((a, index) => {
    startIndex += index;
    return `$${startIndex}`;
  }).join(',');
};

module.exports = {
  query, client, arrayArg
};
