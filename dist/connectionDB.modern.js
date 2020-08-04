const{Pool:o}=require("pg"),{config:n}=require("./config");module.exports=class{constructor(){this.connection=new o({user:n.dbUser,host:n.dbHost,database:n.dbName,password:n.dbPassword,port:n.dbPort})}getConnection(){return this.connection}async closeConnection(){this.connection&&await this.connection.end()}};
//# sourceMappingURL=connectionDB.modern.js.map
