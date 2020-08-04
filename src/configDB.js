require("dotenv").config();

const configDB = {
  dbUser: process.env.DBUSER,
  dbPassword: process.env.DBPASSWORD,
  dbHost: process.env.DBHOST,
  dbPort: process.env.DBPORT,
  dbName: process.env.DBNAME,
  envioroment: process.NODE_ENV,
  statement_timeout: process.DB_STATEMENT_TIMEOUT || "10000",
  query_timeout: process.DB_QUERY_TIMEOUT || "10000",
  connectionTimeoutMillis: process.CONNECT_TIMEOUT || "10000",
};

module.exports = { configDB };
