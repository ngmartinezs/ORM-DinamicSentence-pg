!function(n){"function"==typeof define&&define.amd?define(n):n()}(function(){var n=require("pg").Pool,e=require("./config").config;module.exports=function(){function o(){this.connection=new n({user:e.dbUser,host:e.dbHost,database:e.dbName,password:e.dbPassword,port:e.dbPort})}var t=o.prototype;return t.getConnection=function(){return this.connection},t.closeConnection=function(){try{var n=this,e=function(){if(n.connection)return Promise.resolve(n.connection.end()).then(function(){})}();return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(n){return Promise.reject(n)}},o}()});
//# sourceMappingURL=connectionDB.umd.js.map
