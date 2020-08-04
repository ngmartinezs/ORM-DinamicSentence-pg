const ConnectionDB = require("./connectionDB");
/*Private*/
const obtenerMetaDataTabla = async (
  pConnection,
  pBaseDatos,
  pEsquema,
  pEntidad
) => {
  //console.log(` ${pBaseDatos} ${pEsquema} ${pEntidad}`);
  const META_SQL_TABLES = `select column_name nombre_columna,
                                  column_default valor_por_defecto,
                                  ordinal_position orden,
                                  data_type tipo_dato,
                                  is_nullable es_nulable,
                                  character_maximum_length longitud_char,
                                  numeric_precision longitud_numerica,
                                  numeric_precision_radix numero_decimales
                          from information_schema.columns 
                          where table_catalog= $1 
                          and table_schema = $2 
                          and table_name = $3;`;

  const query = {
    name: "fetch-sql-meta-tables",
    text: META_SQL_TABLES,
    values: [pBaseDatos, pEsquema, pEntidad],
  };

  try {
    const lRetorno = await pConnection.query(query);
    return lRetorno.rows;
  } catch (error) {
    throw error;
  }
};

/*Private*/
const generarSQLConsulta = (pMetaDataArray, pEsquema, pEntidad, pFiltro) => {
  var lSQL = `SELECT `;
  var lContador = 0;
  var lFiltro = ``;
  var lArrayValues = [];
  var lIndiceFiltro = 1;

  if (pMetaDataArray && pFiltro) {
    /**
     * Se genera SQL general de la consulta.
     **/
    pMetaDataArray.forEach((element) => {
      if (lContador == 0) lSQL = `${lSQL} ${element.nombre_columna} `;
      else lSQL = ` ${lSQL} , ${element.nombre_columna}`;

      lContador++;
    });

    lSQL = lSQL + " FROM " + pEsquema + "." + pEntidad;

    /**
     * Se genera los filtros.
     **/
    Object.getOwnPropertyNames(pFiltro).forEach((value, idx, array) => {
      if (pFiltro[value]) {
        if (lFiltro.length === 0) {
          lFiltro = ` ${lFiltro} WHERE ${value} = $${lIndiceFiltro} `;
          lArrayValues.push(pFiltro[value]);
        } else {
          lFiltro = ` ${lFiltro} AND ${value} = $${lIndiceFiltro} `;
          lArrayValues.push(pFiltro[value]);
        }

        lIndiceFiltro++;
      }
    });

    if (lFiltro.length !== 0 && lArrayValues.length > 0)
      return {
        name: "fetch-sql-consulta-tables",
        text: `${lSQL} ${lFiltro}`,
        values: lArrayValues,
      };
  }
};

const generarSQLInsert = (pMetaDataArray, pEsquema, pEntidad, pDatos) => {
  var SQL_INSERT = `INSERT INTO ${pEsquema}.${pEntidad} (`;
  var SQL_VALUES = ` VALUES (`;
  var lId = "";
  var lArrayValues = [];
  var lContador = 1;
  var lDato = "";
  var lRamdonTranId = Math.floor(Math.random() * 1001);

  if (pMetaDataArray && pDatos) {
    pMetaDataArray.forEach((element) => {
      if (element.valor_por_defecto) {
        if (
          element.valor_por_defecto.toLowerCase().includes("nextval") ||
          element.valor_por_defecto.toLowerCase().includes("seq")
        ) {
          lId = element.nombre_columna;
        } else {
          if (pDatos[element.nombre_columna]) {
            SQL_INSERT =
              lContador === 1
                ? ` ${SQL_INSERT} ${element.nombre_columna} `
                : ` ${SQL_INSERT} , ${element.nombre_columna} `;

            SQL_VALUES =
              lContador === 1
                ? ` ${SQL_VALUES} $${lContador} `
                : ` ${SQL_VALUES} , $${lContador} `;

            lArrayValues.push(element.valor_por_defecto);

            lContador++;
          }
        }
      } else {
        //console.log(`.........pDatos =>${JSON.stringify(pDatos)}`);

        if (
          !pDatos[element.nombre_columna.toLowerCase()] &&
          (element.tipo_dato.toLowerCase().includes("timestamp") ||
            element.tipo_dato.toLowerCase().includes("date"))
        ) {
          SQL_INSERT =
            lContador === 1
              ? ` ${SQL_INSERT} ${element.nombre_columna} `
              : ` ${SQL_INSERT} , ${element.nombre_columna} `;

          SQL_VALUES =
            lContador === 1
              ? ` ${SQL_VALUES} now() `
              : ` ${SQL_VALUES} , now() `;
        } else {
          if (pDatos[element.nombre_columna.toLowerCase()]) {
            SQL_INSERT =
              lContador === 1
                ? ` ${SQL_INSERT} ${element.nombre_columna} `
                : ` ${SQL_INSERT} , ${element.nombre_columna} `;

            SQL_VALUES =
              lContador === 1
                ? ` ${SQL_VALUES} $${lContador} `
                : ` ${SQL_VALUES} , $${lContador} `;

            lArrayValues.push(pDatos[element.nombre_columna.toLowerCase()]);
            lContador++;
          }
        }
      }
    });

    return {
      name: `fetch-insert-${lRamdonTranId}`,
      text:
        `${SQL_INSERT} ) ${SQL_VALUES} )` + (lId ? `RETURNING ${lId};` : `;`),
      values: lArrayValues,
    };
  }

  return {};
};

const generarSQLUpdate = (pMetaDataArray, pEsquema, pEntidad, pDatosUpdate) => {
  var SQL_UPDATE = `UPDATE ${pEsquema}.${pEntidad} SET `;
  var SQL_FIELDS = ``;
  var SQL_WHERE = ``;
  var lArrayValues = [];
  var lContador = 1;
  var lDato = "";
  var lRamdonTranId = Math.floor(Math.random() * 1001);

  if (pMetaDataArray && pDatosUpdate) {
    /*Se establecen los valores a actualizar*/
    if (pDatosUpdate.datosActulizar && pDatosUpdate.filtros) {
      pMetaDataArray.forEach((element) => {
        if (
          pDatosUpdate.datosActulizar[element.nombre_columna.toLowerCase()] &&
          (!element.valor_por_defecto ||
            (element.valor_por_defecto &&
              !element.valor_por_defecto.toLowerCase().includes("seq")))
        ) {
          let lSentencia = `${element.nombre_columna} = $${lContador}`;
          SQL_FIELDS = !SQL_FIELDS
            ? ` ${lSentencia} `
            : ` ${SQL_FIELDS} , ${lSentencia} `;

          lArrayValues.push(
            pDatosUpdate.datosActulizar[element.nombre_columna.toLowerCase()]
          );
          lContador++;
        }
      });
      Object.getOwnPropertyNames(pDatosUpdate.filtros).forEach(
        (val, index, array) => {
          let lSentenciaWhere = ` ${val} = $${lContador} `;
          SQL_WHERE = !SQL_WHERE
            ? ` WHERE ${lSentenciaWhere} `
            : ` AND ${val} = $${lContador} `;
          lArrayValues.push(pDatosUpdate.filtros[val]);
          lContador++;
        }
      );

      /*console.log(
        `.........SQL_UPDATE =>${SQL_UPDATE} ${SQL_FIELDS} ${SQL_WHERE}`
      );*/
      return {
        name: `fetch-sql-update-${lRamdonTranId}`,
        text: `${SQL_UPDATE} ${SQL_FIELDS} ${SQL_WHERE};`,
        values: lArrayValues,
      };
    }
  }

  return {};
};

const generarSQLDelete = (pMetaDataArray, pEsquema, pEntidad, pFiltros) => {
  var SQL_DELETE = `DELETE FROM ${pEsquema}.${pEntidad} `;
  var SQL_WHERE = ``;
  var lArrayValues = [];
  var lContador = 1;
  var lDato = "";
  var lRamdonTranId = Math.floor(Math.random() * 1001);

  if (pMetaDataArray && pFiltros) {
    /*Se establecen los valores a actualizar*/

    Object.getOwnPropertyNames(pFiltros).forEach((value, index, array) => {
      var metadato = pMetaDataArray.find((element) => {
        return element.nombre_columna.toLowerCase() === value.toLowerCase();
      });

      if (metadato) {
        let lSentenciaWhere = ` ${value} = $${lContador} `;
        SQL_WHERE = !SQL_WHERE
          ? ` WHERE ${lSentenciaWhere} `
          : ` AND ${value} = $${lContador} `;
        lArrayValues.push(pFiltros[value]);
        lContador++;
      }
    });

    return {
      name: `fetch-sql-delete-${lRamdonTranId}`,
      text: `${SQL_DELETE} ${SQL_WHERE};`,
      values: lArrayValues,
    };
  }

  return {};
};

class ObjectsCrud {
  constructor() {}

  async consultar(pConnectionDB, pBaseDatos, pEsquema, pEntidad, pFiltro) {
    var connectionDB = null;
    var lConnection = pConnectionDB;

    if (!pConnectionDB) {
      connectionDB = new ConnectionDB();
      lConnection = connectionDB.getConnection();
    }

    try {
      const lMetaDataTabla = await obtenerMetaDataTabla(
        lConnection,
        pBaseDatos,
        pEsquema,
        pEntidad
      );

      const lSQLConsulta = generarSQLConsulta(
        lMetaDataTabla,
        pEsquema,
        pEntidad,
        pFiltro
      );

      if (lSQLConsulta) {
        const lResultado = await lConnection.query(lSQLConsulta);

        if (lResultado)
          return {
            CODIGO_RETORNO: 0,
            MENSAJE_RETORNO: "OK",
            DATA: lResultado.rows,
          };
        else
          return {
            CODIGO_RETORNO: 1,
            MENSAJE_RETORNO: "No se encontro data",
            DATA: [],
          };
      } else
        return {
          CODIGO_RETORNO: 2,
          MENSAJE_RETORNO: "No se establecieron filtros de consulta correctos",
          DATA: [],
        };
    } catch (error) {
      throw error;
    } finally {
      if (pConnectionDB) await pConnectionDB.closeConnection();
    }
  }

  async insertar(pConnectionDB, pBaseDatos, pEsquema, pEntidad, pDatos) {
    var lConnection = pConnectionDB;
    var connectionDB = null;
    if (!pConnectionDB) {
      connectionDB = new ConnectionDB();
      lConnection = connectionDB.getConnection();
    }

    try {
      /*console.log(
        `insertar(${pConnectionDB}, ${pBaseDatos}, ${pEsquema}, ${pEntidad}, ${pDatos})`
      );*/
      const lMetaDataTabla = await obtenerMetaDataTabla(
        lConnection,
        pBaseDatos.toLowerCase(),
        pEsquema.toLowerCase(),
        pEntidad.toLowerCase()
      );

      //console.log(`lMetaDataTabla => ${JSON.stringify(lMetaDataTabla)}`);

      if (lMetaDataTabla) {
        const lSqlInsert = generarSQLInsert(
          lMetaDataTabla,
          pEsquema,
          pEntidad,
          pDatos
        );

        //console.log(`lSqlInsert => ${JSON.stringify(lSqlInsert)}`);

        if (lSqlInsert) {
          const lResultado = await lConnection.query(lSqlInsert);

          //console.log(`lResultado => ${JSON.stringify(lResultado)}`);

          if (lResultado)
            return {
              CODIGO_RETORNO: 0,
              MENSAJE_RETORNO: "OK",
              DATA: lResultado.rows,
            };
        }
      }
    } catch (error) {
      throw error;
    } finally {
      if (connectionDB) await connectionDB.closeConnection();
    }

    return {
      CODIGO_RETORNO: 3,
      MENSAJE_RETORNO: "No se insertaron datos",
      DATA: {},
    };
  }

  async update(pConnectionDB, pBaseDatos, pEsquema, pEntidad, pDatos) {
    var lConnection = pConnectionDB;
    var connectionDB = null;
    if (!pConnectionDB) {
      connectionDB = new ConnectionDB();
      lConnection = connectionDB.getConnection();
    }

    try {
      const lMetaDataTabla = await obtenerMetaDataTabla(
        lConnection,
        pBaseDatos.toLowerCase(),
        pEsquema.toLowerCase(),
        pEntidad.toLowerCase()
      );

      //console.log(`lMetaDataTabla => ${JSON.stringify(lMetaDataTabla)}`);

      if (lMetaDataTabla) {
        const lSqlUpdate = generarSQLUpdate(
          lMetaDataTabla,
          pEsquema,
          pEntidad,
          pDatos
        );

        if (lSqlUpdate) {
          //console.log(`lSqlUpdate => ${JSON.stringify(lSqlUpdate)}`);
          const lResultado = await lConnection.query(lSqlUpdate);

          //console.log(`lResultado => ${JSON.stringify(lResultado)}`);

          if (lResultado)
            return {
              CODIGO_RETORNO: 0,
              MENSAJE_RETORNO: "OK",
              DATA: lResultado.rowCount,
            };
        }
      }
    } catch (error) {
      throw error;
    } finally {
      if (connectionDB) await connectionDB.closeConnection();
    }

    return {
      CODIGO_RETORNO: 4,
      MENSAJE_RETORNO: "No se realizaron actualizaciones",
      DATA: {},
    };
  }

  async delete(pConnectionDB, pBaseDatos, pEsquema, pEntidad, pFiltros) {
    var lConnection = pConnectionDB;
    var connectionDB = null;
    if (!pConnectionDB) {
      connectionDB = new ConnectionDB();
      lConnection = connectionDB.getConnection();
    }

    try {
      const lMetaDataTabla = await obtenerMetaDataTabla(
        lConnection,
        pBaseDatos.toLowerCase(),
        pEsquema.toLowerCase(),
        pEntidad.toLowerCase()
      );

      //console.log(`lMetaDataTabla => ${JSON.stringify(lMetaDataTabla)}`);

      if (lMetaDataTabla) {
        const lSqlDelete = generarSQLDelete(
          lMetaDataTabla,
          pEsquema,
          pEntidad,
          pFiltros
        );

        if (lSqlDelete.values.length > 0) {
          // console.log(`lSqlDelete => ${JSON.stringify(lSqlDelete)}`);
          const lResultado = await lConnection.query(lSqlDelete);

          //console.log(`lResultado => ${JSON.stringify(lResultado)}`);

          if (lResultado && lResultado)
            return {
              CODIGO_RETORNO: 0,
              MENSAJE_RETORNO: "OK",
              DATA: lResultado.rowCount,
            };
        }
      }
    } catch (error) {
      throw error;
    } finally {
      if (connectionDB) await connectionDB.closeConnection();
    }

    return {
      CODIGO_RETORNO: 5,
      MENSAJE_RETORNO: "No se eliminaron registros",
      DATA: {},
    };
  }
}

module.exports = ObjectsCrud;
