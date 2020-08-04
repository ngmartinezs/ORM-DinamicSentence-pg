# @ngmartinezs-npm/ORM-DinamicSentence-pg

Librería javascript que permite la coneccion y ejecución de operaciones a nivel de base de datos postgres. Esta librería proporciona métodos para establecer y gestionar la coneccion hacia la base de datos, así como los mecanismos para realizar operación insert, update, delete y select sobre una base de postgres, retirando al equipo de desarrollo la necesidad de hacer líneas para abrir conexiones hacia la base de datos y crear rutinas para acceder a extraer información de la DB.

ORM-DinamicSentence-pg presenta la API para obtener coneccion a la DB, realizar operaciones insert, update, delete, select indicando a dichas API el nombre de la entidad o tabla sobre la que se va a trabajar, el esquema y la base de datos, y ORM-DinamicSentence-pg se encarga de construir las sentencias SQL requeridas para efectuar la operación.

Otro servicio provisto por ORM-DinamicSentence-pg es la posibilidad de configurar Querys de alta complejidad y efectuar la ejecución dinámica del mismo, eliminando la necesidad de tener que crear los objetos que se conectar a la DB y programar estos querys.

## Comenzando 🚀

ORM-DinamicSentence-pg es una librería para DBMS Postgres 9.0.0 o superior que permite la generación de sentencias SQL dinámicas, por que para su correcto funcionamiento ya se usó como cliente de la API o como para mejorar esta librería, requiere que se tenga configurada una base de datos Postgres en la máquina local o acceso hacia la DB sobre la que se quiere conectar.

1. De las base de datos sobre la que se va a trabajar es importante tener claro el valor a asignar a las siguiente variables de entorno.

DBNAME=XX /_Nombre de la base de datos_/
DBUSER=XX /_Usuario con el que se conecta a la base de datos_/
DBPASSWORD=XX /_Pasword de coneccion a la base de datos._/
DBHOST=XXX /_Host de la base de datos_/
DBPORT=XXX /_Puerto de coneccion._/

2. Asegurar que el usuario con el que va a conectar a la base de datos cuenta con los permisos requeridos para efectuar la operación que se va a utilizar.

3. Para uso de la api de querys dinámicos, es importante que a nivel de su DBMS al cual se va a conectar, se cree la estructura de la tabla sobre la que se almacena la información de los SQL dinamientos. Por favor referirse a la carpeta SQL del repositorio donde se deja la estructura base requerida.

### Pre-requisitos 📋

1. Se debe asegurar que se cuente con los datos para parametrizar las variables de entorno,
   asegurando no dejar espacios entre el nombre de la variable y el valor.

```
DBNAME=/*Nombre de la base de datos*/
DBUSER=/*Usuario con el que se conecta a la base de datos*/
DBPASSWORD=/*Pasword de coneccion a la base de datos.*/
DBHOST=/*Host de la base de datos*/
DBPORT=/*Puerto de coneccion.*/
```

### Instalación 🔧

Para realizar la instalacion de la libreria, se debe ejecutar el siguiente comando.

```
 npm install @ngmartinezs-npm/ORM-DinamicSentence-pg
```

### Modo de Uso 🔧

Para usar la libreria se puede usar en tres modalidades:

## 1) Obtener coneccion de base de datos de forma Pool

```
const ConnectionDB = require("./connectionDB");
const ObjectCrud = require("./objectCrud");
const { configDB } = require("./configDB");

const pruebaTransactionDBPool = async () => {
  console.log("Se inicial ejecucion --> pruebaTransactionDBPool");
  var lConnectionDB = null;

  try {
    /*Se obtiene coneccion a  la base de datos a mode de pool*/
    lConnectionDB = new ConnectionDB("Pool");

    const lResultI1 = await lConnectionDB.getConnection().query({
      name: "fetch-insert1",
      text:
        "insert into public.table_with_seq (data,fecha_creacion) values ($1,now());",
      values: ["Prueba Transaction1"],
    });
    console.log("Se ejecuta fetch-insert1 => " + JSON.stringify(lResultI1));

  } catch (error) {
    console.log("ERROR pruebaTransactionDBPool => " + error);
  } finally {
    /*Se libera la coneccion*/
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
};
```

## 2) Obtener coneccion de base de datos de forma Client

```
  var lConnectionDB;
  try {
    /*Se obtiene coneccion como Cliente*/
    lConnectionDB = new ConnectionDB("Client");
    console.log("lConnectionDB --> " + JSON.stringify(lConnectionDB));

    /*Se marca inicio de transaccion*/
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

    /*Se confirma transaccion*/
    await lConnectionDB.commitTransaction();
  } catch (error) {
    /*Se hace rollback de la transaccion*/
    if (lConnectionDB) lConnectionDB.rollBackTransaction();
    console.log("ERROR pruebaTransactionDBPool => " + error);
  } finally {
    /*Se cierra la coneccion*/
    if (lConnectionDB) await lConnectionDB.closeConnection();
  }
```

## 3)Hacer uso de CRUDS

### 3.1) Metodo Insertar mediante el api de CrudObjects

```
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
};
```

### 3.2) Metodo Actualizar mediante api de CrudObjects

```
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
```

### 3.3) Metodo Select mediante api de CrudsObjects

```
const lRespuesta = await objectCrud.consultar(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        { id: "1" }
      );
      assert.notEqual(lRespuesta.DATA.length, 0);
```

### 3.4) Metodo Delete mediante Api de CrudsObjects

```
 const lFiltros = { id: "1" };

      const lRespuesta = await objectCrud.delete(
        null,
        configDB.dbName,
        ESQUEMA_TABLE_TEST,
        TABLE_TEST_WITH_SEQ,
        lFiltros
      );
      console.log(`Respuesta delete-WithSeq => ${JSON.stringify(lRespuesta)}`);
```

## 4) Uso del Api de SQL dinamico

```
 const TABLE_QUERY_DINAMIC = "table_query_dinamic";
 const generarDataQuery = require("../src/dinamicQuery");

 const lRespuesta = await generarDataQuery(
        null,
        ESQUEMA_TABLE_TEST,
        TABLE_QUERY_DINAMIC,
        "QUERY_TEST",
        { num: "1" }
      );
      /*console.log(
        `Respuesta generarDataQuery => ${JSO
```

### Instalación En Desarrollo 🔧

Si el proposito de la libreria es validarla en ambiente de desarrollo para ajustarla, modificarla o mejorarla, primero descargue el proyecto, clonelo o efectue un fork.

```
 git clone https://github.com/ngmartinezs/ORM-DinamicSentence-pg.git
```

## Ejecutando las pruebas De Desarrollo ⚙️

Si se quiere probar la libreria en modo de desarrollo, se debe ejecutar el siguientes comando, asegurandose de establecer el valor de las variables de entorno.

```
  npm run test
```

## Construido con 🛠️

- [Visual Studio Code](https://code.visualstudio.com/) - Id Desarrollo
- [pg](https://node-postgres.com/) - Libreria para conectarse a postgres desde nodejs
- [dotenv](https://www.npmjs.com/package/dotenv) - Libreria para obtener el valor de la variables de entorno.
- [postgres](https://www.postgresql.org/)

## Contribuyendo 🖇️

## Wiki 📖

## Versionado 📌

Para todas las versiones disponibles, mira los [tags en este repositorio](https://github.com/ngmartinezs/ORM-DinamicSentence-pg.gits).

## Autores ✒️

- **Nestor Gonzalo Martinez Sarmiento** -
  ngmartinezs@gmail.com
  @ngmartinezs

## Licencia 📄

Este proyecto está bajo la Licencia GPU - mira el archivo [LICENSE.md](LICENSE.md) para detalles

⌨️ Cordialmente [Nestor Martinez](https://github.com/ngmartinezs) 😊
