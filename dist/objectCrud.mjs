function n(n,e){try{var r=n()}catch(n){return e(n)}return r&&r.then?r.then(void 0,e):r}var e=require("./connectionDB");function r(n,e){try{var r=n()}catch(n){return e(!0,n)}return r&&r.then?r.then(e.bind(null,!1),e.bind(null,!0)):e(!1,r)}var o=function(e,r,o,t){try{var u={name:"fetch-sql-meta-tables",text:"select column_name nombre_columna,\n                                  column_default valor_por_defecto,\n                                  ordinal_position orden,\n                                  data_type tipo_dato,\n                                  is_nullable es_nulable,\n                                  character_maximum_length longitud_char,\n                                  numeric_precision longitud_numerica,\n                                  numeric_precision_radix numero_decimales\n                          from information_schema.columns \n                          where table_catalog= $1 \n                          and table_schema = $2 \n                          and table_name = $3;",values:[r,o,t]};return Promise.resolve(n(function(){return Promise.resolve(e.query(u)).then(function(n){return n.rows})},function(n){throw n}))}catch(n){return Promise.reject(n)}};module.exports=function(){function t(){}var u=t.prototype;return u.consultar=function(t,u,c,i,a){try{var s=null,l=t;return t||(s=new e,l=s.getConnection()),Promise.resolve(r(function(){return n(function(){return Promise.resolve(o(l,u,c,i)).then(function(n){var e=function(n,e,r,o){var t="SELECT ",u=0,c="",i=[],a=1;if(n&&o&&(n.forEach(function(n){t=0==u?t+" "+n.nombre_columna+" ":" "+t+" , "+n.nombre_columna,u++}),t=t+" FROM "+e+"."+r,Object.getOwnPropertyNames(o).forEach(function(n,e,r){o[n]&&(0===c.length?(c=" "+c+" WHERE "+n+" = $"+a+" ",i.push(o[n])):(c=" "+c+" AND "+n+" = $"+a+" ",i.push(o[n])),a++)}),0!==c.length&&i.length>0))return{name:"fetch-sql-consulta-tables",text:t+" "+c,values:i}}(n,c,i,a);return e?Promise.resolve(l.query(e)).then(function(n){return n?{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:n.rows}:{CODIGO_RETORNO:1,MENSAJE_RETORNO:"No se encontro data",DATA:[]}}):{CODIGO_RETORNO:2,MENSAJE_RETORNO:"No se establecieron filtros de consulta correctos",DATA:[]}})},function(n){throw n})},function(n,e){function r(){if(n)throw e;return e}var o=function(){if(t)return Promise.resolve(t.closeConnection()).then(function(){})}();return o&&o.then?o.then(r):r()}))}catch(n){return Promise.reject(n)}},u.insertar=function(t,u,c,i,a){try{var s,l=function(n){return s?n:{CODIGO_RETORNO:3,MENSAJE_RETORNO:"No se insertaron datos",DATA:{}}},f=t,m=null;t||(m=new e,f=m.getConnection());var h=r(function(){return n(function(){return Promise.resolve(o(f,u.toLowerCase(),c.toLowerCase(),i.toLowerCase())).then(function(n){return function(){if(n){var e=function(n,e,r,o){var t="INSERT INTO "+e+"."+r+" (",u=" VALUES (",c="",i=[],a=1,s=Math.floor(1001*Math.random());return n&&o?(n.forEach(function(n){n.valor_por_defecto?n.valor_por_defecto.toLowerCase().includes("nextval")||n.valor_por_defecto.toLowerCase().includes("seq")?c=n.nombre_columna:o[n.nombre_columna]&&(t=1===a?" "+t+" "+n.nombre_columna+" ":" "+t+" , "+n.nombre_columna+" ",u=1===a?" "+u+" $"+a+" ":" "+u+" , $"+a+" ",i.push(n.valor_por_defecto),a++):o[n.nombre_columna.toLowerCase()]||!n.tipo_dato.toLowerCase().includes("timestamp")&&!n.tipo_dato.toLowerCase().includes("date")?o[n.nombre_columna.toLowerCase()]&&(t=1===a?" "+t+" "+n.nombre_columna+" ":" "+t+" , "+n.nombre_columna+" ",u=1===a?" "+u+" $"+a+" ":" "+u+" , $"+a+" ",i.push(o[n.nombre_columna.toLowerCase()]),a++):(t=1===a?" "+t+" "+n.nombre_columna+" ":" "+t+" , "+n.nombre_columna+" ",u=1===a?" "+u+" now() ":" "+u+" , now() ")}),{name:"fetch-insert-"+s,text:t+" ) "+u+" )"+(c?"RETURNING "+c+";":";"),values:i}):{}}(n,c,i,a);return function(){if(e)return Promise.resolve(f.query(e)).then(function(n){if(n)return s=1,{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:n.rows}})}()}}()})},function(n){throw n})},function(n,e){function r(){if(n)throw e;return e}var o=function(){if(m)return Promise.resolve(m.closeConnection()).then(function(){})}();return o&&o.then?o.then(r):r()});return Promise.resolve(h&&h.then?h.then(l):l(h))}catch(n){return Promise.reject(n)}},u.update=function(t,u,c,i,a){try{var s,l=function(n){return s?n:{CODIGO_RETORNO:4,MENSAJE_RETORNO:"No se realizaron actualizaciones",DATA:{}}},f=t,m=null;t||(m=new e,f=m.getConnection());var h=r(function(){return n(function(){return Promise.resolve(o(f,u.toLowerCase(),c.toLowerCase(),i.toLowerCase())).then(function(n){return function(){if(n){var e=function(n,e,r,o){var t="UPDATE "+e+"."+r+" SET ",u="",c="",i=[],a=1,s=Math.floor(1001*Math.random());return n&&o&&o.datosActulizar&&o.filtros?(n.forEach(function(n){if(o.datosActulizar[n.nombre_columna.toLowerCase()]&&(!n.valor_por_defecto||n.valor_por_defecto&&!n.valor_por_defecto.toLowerCase().includes("seq"))){var e=n.nombre_columna+" = $"+a;u=u?" "+u+" , "+e+" ":" "+e+" ",i.push(o.datosActulizar[n.nombre_columna.toLowerCase()]),a++}}),Object.getOwnPropertyNames(o.filtros).forEach(function(n,e,r){c=c?" AND "+n+" = $"+a+" ":" WHERE  "+n+" = $"+a+"  ",i.push(o.filtros[n]),a++}),{name:"fetch-sql-update-"+s,text:t+" "+u+" "+c+";",values:i}):{}}(n,c,i,a);return function(){if(e)return Promise.resolve(f.query(e)).then(function(n){if(n)return s=1,{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:n.rowCount}})}()}}()})},function(n){throw n})},function(n,e){function r(){if(n)throw e;return e}var o=function(){if(m)return Promise.resolve(m.closeConnection()).then(function(){})}();return o&&o.then?o.then(r):r()});return Promise.resolve(h&&h.then?h.then(l):l(h))}catch(n){return Promise.reject(n)}},u.delete=function(t,u,c,i,a){try{var s,l=function(n){return s?n:{CODIGO_RETORNO:5,MENSAJE_RETORNO:"No se eliminaron registros",DATA:{}}},f=t,m=null;t||(m=new e,f=m.getConnection());var h=r(function(){return n(function(){return Promise.resolve(o(f,u.toLowerCase(),c.toLowerCase(),i.toLowerCase())).then(function(n){return function(){if(n){var e=function(n,e,r,o){var t="DELETE FROM "+e+"."+r+" ",u="",c=[],i=1,a=Math.floor(1001*Math.random());return n&&o?(Object.getOwnPropertyNames(o).forEach(function(e,r,t){n.find(function(n){return n.nombre_columna.toLowerCase()===e.toLowerCase()})&&(u=u?" AND "+e+" = $"+i+" ":" WHERE  "+e+" = $"+i+"  ",c.push(o[e]),i++)}),{name:"fetch-sql-delete-"+a,text:t+" "+u+";",values:c}):{}}(n,c,i,a);return function(){if(e.values.length>0)return Promise.resolve(f.query(e)).then(function(n){if(n&&n)return s=1,{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:n.rowCount}})}()}}()})},function(n){throw n})},function(n,e){function r(){if(n)throw e;return e}var o=function(){if(m)return Promise.resolve(m.closeConnection()).then(function(){})}();return o&&o.then?o.then(r):r()});return Promise.resolve(h&&h.then?h.then(l):l(h))}catch(n){return Promise.reject(n)}},t}();
//# sourceMappingURL=objectCrud.mjs.map
