var n=require("pg").Pool,o=require("./config").config;module.exports=function(){function e(){this.connection=new n({user:o.dbUser,host:o.dbHost,database:o.dbName,password:o.dbPassword,port:o.dbPort})}var t=e.prototype;return t.getConnection=function(){return this.connection},t.closeConnection=function(){try{var n=this,o=function(){if(n.connection)return Promise.resolve(n.connection.end()).then(function(){})}();return Promise.resolve(o&&o.then?o.then(function(){}):void 0)}catch(n){return Promise.reject(n)}},e}();
//# sourceMappingURL=connectionDB.js.map
