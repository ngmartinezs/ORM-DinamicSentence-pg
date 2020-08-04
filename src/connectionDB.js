const { Pool, Client } = require("pg");
const { configDB } = require("./configDB");

class ConneectionDB {
  constructor(pTipo) {
    if (pTipo === "Client") {
      this.typeConnection = "Client";
      this.connection = new Client({
        user: configDB.dbUser,
        host: configDB.dbHost,
        database: configDB.dbName,
        password: configDB.dbPassword,
        port: configDB.dbPort,
        "statement_timeout?": configDB.statement_timeout,
        "query_timeout?": configDB.query_timeout,
        "connectionTimeoutMillis?": configDB.connectionTimeoutMillis,
      });
      this.connection.connect();
    } else {
      this.typeConnection = "Pool";
      this.connection = new Pool({
        user: configDB.dbUser,
        host: configDB.dbHost,
        database: configDB.dbName,
        password: configDB.dbPassword,
        port: configDB.dbPort,
        "statement_timeout?": configDB.statement_timeout,
        "query_timeout?": configDB.query_timeout,
        "connectionTimeoutMillis?": configDB.connectionTimeoutMillis,
      });
    }
  }

  getConnection() {
    return this.connection;
  }

  async closeConnection() {
    if (this.connection) await this.connection.end();
  }

  async beginTransaction() {
    if (this.typeConnection === "Client") {
      await this.connection.query("BEGIN");
    } else {
      throw "No es valida iniciar trasacction sobre tipo de conneccion Pool";
    }
  }

  async commitTransaction() {
    if (this.typeConnection === "Client") {
      await this.connection.query("COMMIT");
    } else {
      throw "No es valida iniciar trasacction sobre tipo de conneccion Pool";
    }
  }

  async rollBackTransaction() {
    if (this.typeConnection === "Client") {
      await this.connection.query("ROLLBACK");
    } else {
      throw "No es valida iniciar trasacction sobre tipo de conneccion Pool";
    }
  }
}

module.exports = ConneectionDB;
