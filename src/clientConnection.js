const ConnectionDB = require("./connectionDB");
const ObjectCrud = require("./objectCrud");
const { configDB } = require("./configDB");

const pruebaTransactionDBPool = async () => {
  console.log("Se inicial ejecucion --> pruebaTransactionDBPool");
  var lConnectionDB = null;

  try {
    lConnectionDB = new ConnectionDB("Pool");

    const lResultI1 = await lConnectionDB.getConnection().query({
      name: "fetch-insert1",
      text:
        "insert into public.table_with_seq (data,fecha_creacion) values ($1,now());",
      values: ["Prueba Transaction1"],
    });
    console.log("Se ejecuta fetch-insert1 => " + JSON.stringify(lResultI1));

    const idAleatorio = Math.floor(Math.random() * 101);
    const lResultI2 = await lConnectionDB.getConnection().query({
      name: "fetch-insert2",
      text:
        "insert into public.table_without_seq (id,data,fecha_creacion) values ($1,$2,now());",
      values: [idAleatorio, "Prueba Transaction1"],
    });
    console.log("Se ejecuta fetch-insert2 => " + JSON.stringify(lResultI2));
  } catch (error) {
    console.log("ERROR pruebaTransactionDBPool => " + error);
  } finally {
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
};

const pruebaTransactionDBClient = async () => {
  console.log("Se inicial ejecucion --> pruebaTransactionDBClient");
  var lConnectionDB;
  try {
    lConnectionDB = new ConnectionDB("Client");
    console.log("lConnectionDB --> " + JSON.stringify(lConnectionDB));

    await lConnectionDB.beginTransaction();
    const lResultI1 = await lConnectionDB.getConnection().query({
      name: "fetch-insert1",
      text:
        "insert into public.table_with_seq (data,fecha_creacion) values ($1,now());",
      values: ["Prueba Transaction1"],
    });
    console.log("Se ejecuta fetch-insert1 => " + JSON.stringify(lResultI1));

    const idAleatorio = Math.floor(Math.random() * 101);
    const lResultI2 = await lConnectionDB.getConnection().query({
      name: "fetch-insert2",
      text:
        "insert into public.table_without_se (id,data,fecha_creacion) values ($1,$2,now());",
      values: [idAleatorio, "Prueba Transaction1"],
    });
    console.log("Se ejecuta fetch-insert2 => " + JSON.stringify(lResultI2));
    await lConnectionDB.commitTransaction();
  } catch (error) {
    if (lConnectionDB) lConnectionDB.rollBackTransaction();
    console.log("ERROR pruebaTransactionDBPool => " + error);
  } finally {
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
};

const pruebaTransactionDBPoolObjectCrud = async () => {
  console.log("Se inicial ejecucion --> pruebaTransactionDBPool");
  var lConnectionDB = null;

  try {
    lConnectionDB = new ConnectionDB("Pool");
    const lObjectCrud = new ObjectCrud();

    const lResultI1 = await lObjectCrud.insertar(
      lConnectionDB.getConnection(),
      configDB.dbName,
      "public",
      "table_with_seq",
      { data: "Prueba Transaction1-crud" }
    );

    console.log(
      "Se ejecuta fetch-insert1-crud => " + JSON.stringify(lResultI1)
    );

    const idAleatorio = Math.floor(Math.random() * 101);
    const lResultI2 = await lObjectCrud.insertar(
      lConnectionDB.getConnection(),
      configDB.dbName,
      "public",
      "table_without_seq",
      { id: idAleatorio, data: "Prueba Transaction2-crud" }
    );
    console.log(
      "Se ejecuta fetch-insert2-crud => " + JSON.stringify(lResultI2)
    );
  } catch (error) {
    console.log("ERROR pruebaTransactionDBPool => " + error);
  } finally {
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
};

const pruebaTransactionDBClientObjectCrud = async () => {
  console.log("Se inicial ejecucion --> pruebaTransactionDBClientObjectCrud");
  var lConnectionDB = null;

  try {
    lConnectionDB = new ConnectionDB("Client");
    const lObjectCrud = new ObjectCrud();

    await lConnectionDB.beginTransaction();
    const lResultI1 = await lObjectCrud.insertar(
      lConnectionDB.getConnection(),
      configDB.dbName,
      "public",
      "table_with_seq",
      { data: "Prueba Transaction1-crud" }
    );

    console.log(
      "Se ejecuta fetch-insert1-crud => " + JSON.stringify(lResultI1)
    );

    const idAleatorio = Math.floor(Math.random() * 101);
    const lResultI2 = await lObjectCrud.insertar(
      lConnectionDB.getConnection(),
      configDB.dbName,
      "public",
      "table_without_seq",
      { id: idAleatorio, data: "Prueba Transaction2-crud" }
    );

    await lConnectionDB.commitTransaction();
    console.log(
      "Se ejecuta fetch-insert2-crud => " + JSON.stringify(lResultI2)
    );
  } catch (error) {
    if (lConnectionDB) await lConnectionDB.rollBackTransaction();
    console.log("ERROR pruebaTransactionDBClientObjectCrud => " + error);
  } finally {
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
};

//pruebaTransactionDBPool();
//pruebaTransactionDBClient();
//pruebaTransactionDBPoolObjectCrud();
pruebaTransactionDBClientObjectCrud();
