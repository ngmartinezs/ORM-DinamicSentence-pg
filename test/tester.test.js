const assert = require("assert");
const ObjectCrud = require("../src/objectCrud");
const ConnectionDB = require("../src/connectionDB");
const { configDB } = require("../src/configDB");
const generarDataQuery = require("../src/dinamicQuery");
const ESQUEMA_TABLE_TEST = "public";
const TABLE_TEST_WITH_SEQ = "TABLE_WITH_SEQ";
const TABLE_TEST_WITHOUT_SEQ = "TABLE_WITHOUT_SEQ";
const TABLE_QUERY_DINAMIC = "table_query_dinamic";

describe("ObjectCrud", async () => {
  const objectCrud = new ObjectCrud();
  const connectionDB = new ConnectionDB();
  const lConnectionDB = connectionDB.getConnection();

  /**
   * Inician los test
   **/
  describe("insertar-WithSeq", async () => {
    console.log("insertar-WithSeq");
    it("Se valida si el insert con sobre tabla con sequencia funciona.", async () => {
      const datos = {
        id: "",
        data: "Esto es una prueba en tabla con sequencia",
        fecha_creacion: null,
      };
      const lRespuesta = await objectCrud.insertar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        datos
      );

      console.log(
        `Respuesta insertar-WithSeq => ${JSON.stringify(lRespuesta)} \n`
      );
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("insertar-WithOutSeq", async () => {
    it("Se valida si el insert con sobre tabla con sequencia funciona.", async () => {
      const datos = {
        id: "100",
        data: "Esto es una prueba en tabla con sequencia",
        fecha_creacion: null,
      };
      const lRespuesta = await objectCrud.insertar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITHOUT_SEQ,
        datos
      );

      /*console.log(
        `Respuesta insertar-WithSeq => ${JSON.stringify(lRespuesta)}`
      );*/
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("update-WithSeq", () => {
    console.log("update-WithSeq");
    it("Debe retornar como indicador de retorno del servicio 0", async () => {
      const datosUpdate = {
        datosActulizar: { data: "Datos modificados" },
        filtros: { id: "1" },
      };
      const lRespuesta = await objectCrud.update(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        datosUpdate
      );

      console.log(`Respuesta update-WithSeq => ${JSON.stringify(lRespuesta)}`);
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("update-WithOutSeq", () => {
    console.log("update-WithOutSeq");
    it("Debe retornar como indicador de retorno del servicio 0", async () => {
      const datosUpdate = {
        datosActulizar: { data: "Datos modificados" },
        filtros: { id: "100" },
      };
      const lRespuesta = await objectCrud.update(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITHOUT_SEQ,
        datosUpdate
      );

      console.log(
        `Respuesta update-WithOutSeq => ${JSON.stringify(lRespuesta)}`
      );
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("consultar-WithSeq", async () => {
    it("Debe retornar una cantidad de registros superior a una para la consulta realizada", async () => {
      const lRespuesta = await objectCrud.consultar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        { id: "1" }
      );
      assert.notEqual(lRespuesta.DATA.length, 0);
    });
  });

  describe("consultar-WithOutSeq", async () => {
    it("Debe retornar una cantidad de registros superior a una para la consulta realizada", async () => {
      const lRespuesta = await objectCrud.consultar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITHOUT_SEQ,
        { id: "100" }
      );
      assert.notEqual(lRespuesta.DATA.length, 0);
    });
  });

  describe("delete-WithSeq", () => {
    console.log("delete-WithSeq");
    it("Debe retornar como indicador de retorno del servicio 0", async () => {
      const lFiltros = { id: "1" };

      const lRespuesta = await objectCrud.delete(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        lFiltros
      );
      console.log(`Respuesta delete-WithSeq => ${JSON.stringify(lRespuesta)}`);
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("delete-WithOutSeq", () => {
    console.log("delete-WithOutSeq");
    it("Debe retornar como indicador de retorno del servicio 0", async () => {
      const lFiltros = { id: "100" };

      const lRespuesta = await objectCrud.delete(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITHOUT_SEQ,
        lFiltros
      );
      console.log(
        `Respuesta delete-WithOutSeq => ${JSON.stringify(lRespuesta)}`
      );
      assert.equal(lRespuesta.CODIGO_RETORNO, "0");
    });
  });

  describe("consultar-WithSeq-0-rows", async () => {
    it("Debe retornar 0 registros", async () => {
      const lRespuesta = await objectCrud.consultar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        { id: "1" }
      );
      assert.equal(lRespuesta.DATA.length, 0);
    });
  });

  describe("consultar-WithOutSeq-0-rows", async () => {
    it("Debe retornar 0 registros", async () => {
      const lRespuesta = await objectCrud.consultar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITHOUT_SEQ,
        { id: "100" }
      );
      assert.equal(lRespuesta.DATA.length, 0);
    });
  });

  describe("generarDataQuery", async () => {
    it("Debe al menos un registro", async () => {
      const lRespuesta = await generarDataQuery(
        null,
        ESQUEMA_TABLE_TEST,
        TABLE_QUERY_DINAMIC,
        "QUERY_TEST",
        { num: "1" }
      );
      /*console.log(
        `Respuesta generarDataQuery => ${JSON.stringify(lRespuesta)}`
      );*/
      assert.notEqual(lRespuesta.DATA.length, 0);
    });
  });

  await connectionDB.closeConnection();
});
