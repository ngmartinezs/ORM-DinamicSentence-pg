const e=require("./connectionDB"),t=(e,t)=>`select query_id,\n                   proposito,\n                    sql_sentence\n            from ${e}.${t}\n    where query_id = $1`;module.exports=async(n,r,o,s,c)=>{const a=[];var l=n,i=null;n||(l=(i=new e).getConnection());try{if(r&&o&&s&&c){const e=await(async(e,n,r,o)=>{try{const s={name:"fetch-query-template",text:t(n,r),values:[o]};return(await e.query(s)).rows[0]}catch(e){throw e}})(l,r,o,s);if(e&&e.sql_sentence&&Object.getOwnPropertyNames(c).forEach((e,t,n)=>{c[e]&&a.push(c[e])}),a.length>0){const t={name:"fetch-sql-"+s,text:e.sql_sentence,values:a},n=await l.query(t);if(n)return{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:n.rows}}}}catch(e){throw e}finally{i&&await i.closeConnection()}return{CODIGO_RETORNO:6,MENSAJE_RETORNO:"No se logro emsamblar el query",DATA:{}}};
//# sourceMappingURL=dinamicQuery.modern.js.map