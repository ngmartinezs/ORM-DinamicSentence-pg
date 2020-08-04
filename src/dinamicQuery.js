const ConnectionDB = require("./connectionDB");

const SQL_TABLE_CONF_QUERY = (pEsquema, pTableQuery) => {
  return `select query_id,
                   proposito,
                    sql_sentence
            from ${pEsquema}.${pTableQuery}
    where query_id = $1`;
};

const obtenerQueryBase = async (
  pConnectionDB,
  pEsquema,
  pTableQuery,
  pQueryId
) => {
  try {
    const lQuery = {
      name: "fetch-query-template",
      text: SQL_TABLE_CONF_QUERY(pEsquema, pTableQuery),
      values: [pQueryId],
    };

    const lResult = await pConnectionDB.query(lQuery);

    return lResult.rows[0];
  } catch (error) {
    throw error;
  }
};

const generarDataQuery = async (
  pConnectionDB,
  pEsquema,
  pTableQuery,
  pQueryId,
  pFiltros
) => {
  const arrayValues = [];
  var lConnection = pConnectionDB;
  var connectionDB = null;
  if (!pConnectionDB) {
    connectionDB = new ConnectionDB();
    lConnection = connectionDB.getConnection();
  }

  try {
    if (pEsquema && pTableQuery && pQueryId && pFiltros) {
      const lDefConfQuery = await obtenerQueryBase(
        lConnection,
        pEsquema,
        pTableQuery,
        pQueryId
      );

      //console.log(`lDefConfQuery => ${JSON.stringify(lDefConfQuery)}`);

      if (lDefConfQuery && lDefConfQuery.sql_sentence) {
        Object.getOwnPropertyNames(pFiltros).forEach((value, idx, array) => {
          if (pFiltros[value]) arrayValues.push(pFiltros[value]);
        });
      }

      if (arrayValues.length > 0) {
        const lQueryFinal = {
          name: `fetch-sql-${pQueryId}`,
          text: lDefConfQuery.sql_sentence,
          values: arrayValues,
        };

        //console.log(`lQueryFinal => ${JSON.stringify(lQueryFinal)}`);

        const lResult = await lConnection.query(lQueryFinal);
        if (lResult) {
          return {
            CODIGO_RETORNO: 0,
            MENSAJE_RETORNO: "OK",
            DATA: lResult.rows,
          };
        }
      }
    }
  } catch (error) {
    throw error;
  } finally {
    if (connectionDB) await connectionDB.closeConnection();
  }
  return {
    CODIGO_RETORNO: 6,
    MENSAJE_RETORNO: "No se logro emsamblar el query",
    DATA: {},
  };
};

module.exports = generarDataQuery;
