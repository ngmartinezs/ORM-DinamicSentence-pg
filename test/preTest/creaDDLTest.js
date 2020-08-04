const ConnectionDB = require("../../src/connectionDB");
const ESQUEMA_TABLE_TEST = "public";
const TABLE_TEST_WITH_SEQ = "TABLE_WITH_SEQ";
const TABLE_TEST_WITHOUT_SEQ = "TABLE_WITHOUT_SEQ";
const TABLE_TEST_QUERY_DINAMIC = "TABLE_QUERY_DINAMIC";

const SQL_DROP_TABLE_WITH_SEQ = (pEsquema) => {
  return {
    name: "drop-table-with-seq",
    text: `DROP TABLE IF EXISTS ${pEsquema}.${TABLE_TEST_WITH_SEQ};`,
    values: [],
  };
};

const SQL_DROP_TABLE_WITHOUT_SEQ = (pEsquema) => {
  return {
    name: "drop-table-with-Out-seq",
    text: `DROP TABLE IF EXISTS ${pEsquema}.${TABLE_TEST_WITHOUT_SEQ};`,
    values: [],
  };
};

const SQL_DROP_TABLE_QUERY_DINAMIC = (pEsquema) => {
  return {
    name: "drop-table-dinamic-query",
    text: `DROP TABLE IF EXISTS ${pEsquema}.${TABLE_TEST_QUERY_DINAMIC};`,
    values: [],
  };
};

const SQL_CREATE_TABLE_WITH_SEQ = (pEsquema) => {
  return {
    name: "create-table-with-seq",
    text: `CREATE TABLE ${pEsquema}.${TABLE_TEST_WITH_SEQ}(
      ID  serial NOT NULL,
      DATA varchar(250) ,
      FECHA_CREACION timestamp NOT NULL,
      CONSTRAINT TABLE_WITH_SEQ_pk PRIMARY KEY (ID)); 
    `,
    values: [],
  };
};

const SQL_CREATE_TABLE_WITHOUT_SEQ = (pEsquema) => {
  return {
    name: "create-table-without-seq",
    text: `CREATE TABLE ${pEsquema}.${TABLE_TEST_WITHOUT_SEQ}(
      ID  integer NOT NULL,
      DATA varchar(250) ,
      FECHA_CREACION timestamp NOT NULL,
      CONSTRAINT TABLE_WITHOUT_SEQ_pk PRIMARY KEY (ID)); 
    `,
    values: [],
  };
};

const SQL_CREATE_TABLE_QUERY_DINAMIC = (pEsquema) => {
  return {
    name: "create-table-dinamic-query",
    text: `CREATE TABLE ${pEsquema}.${TABLE_TEST_QUERY_DINAMIC}(
      query_id  varchar(50),
      proposito varchar(250) ,
      sql_sentence text,
      CONSTRAINT QUERY_DINAMIC_pk PRIMARY KEY (query_id)); 
    `,
    values: [],
  };
};

const INSERT_TABLE_QUERY_DINAMIC = (pEsquema) => {
  return {
    name: "fecth-insert-dinamic-query",
    text: `insert into ${pEsquema}.${TABLE_TEST_QUERY_DINAMIC}
           values ('QUERY_TEST',
                   'Query test',
                   'select * from (select column_name nombre_columna,
                                  column_default valor_por_defecto,
                                  ordinal_position orden,
                                  data_type tipo_dato,
                                  is_nullable es_nulable,
                                  character_maximum_length longitud_char,
                                  numeric_precision longitud_numerica,
                                  numeric_precision_radix numero_decimales
                          from information_schema.columns 
                          LIMIT 10) as interno
                          where 1 = $1');`,
    values: [],
  };
};

const createTablesTest = async () => {
  const connectionDB = new ConnectionDB();
  const lConnectionDB = connectionDB.getConnection();
  var lResultDDL = null;

  try {
    /**
     * Se realiza la creacion de tablas para pruebas.
     **/
    console.log("Inicia DDL");
    lResultDDL = await lConnectionDB.query(
      SQL_DROP_TABLE_WITH_SEQ(ESQUEMA_TABLE_TEST)
    );
    //console.log(`DROP table test with seq => ${JSON.stringify(lResultDDL)}`);

    lResultDDL = await lConnectionDB.query(
      SQL_DROP_TABLE_WITHOUT_SEQ(ESQUEMA_TABLE_TEST)
    );
    //console.log(`DROP table test without seq => ${JSON.stringify(lResultDDL)}`);

    lResultDDL = await lConnectionDB.query(
      SQL_DROP_TABLE_QUERY_DINAMIC(ESQUEMA_TABLE_TEST)
    );

    lResultDDL = await lConnectionDB.query(
      SQL_CREATE_TABLE_WITH_SEQ(ESQUEMA_TABLE_TEST)
    );
    //console.log(`CREATE table test with seq => ${JSON.stringify(lResultDDL)}`);

    lResultDDL = await lConnectionDB.query(
      SQL_CREATE_TABLE_WITHOUT_SEQ(ESQUEMA_TABLE_TEST)
    );

    lResultDDL = await lConnectionDB.query(
      SQL_DROP_TABLE_QUERY_DINAMIC(ESQUEMA_TABLE_TEST)
    );

    lResultDDL = await lConnectionDB.query(
      SQL_CREATE_TABLE_QUERY_DINAMIC(ESQUEMA_TABLE_TEST)
    );

    lResultDDL = await lConnectionDB.query(
      INSERT_TABLE_QUERY_DINAMIC(ESQUEMA_TABLE_TEST)
    );
    console.log(`Insertar Query Dinamic => ${JSON.stringify(lResultDDL)}`);

    /*console.log(
      `CREATE table test without seq => ${JSON.stringify(lResultDDL)}`
    );*/
    console.log("Finaliza DDL");

    lConnectionDB.query("COMMIT");
  } catch (error) {
    console.log(`Error en el DDL TEST ${error}`);
  } finally {
    await connectionDB.closeConnection();
  }
};

createTablesTest();
