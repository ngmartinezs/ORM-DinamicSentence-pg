!function(e){"function"==typeof define&&define.amd?define(e):e()}(function(){function e(e,n){try{var t=e()}catch(e){return n(e)}return t&&t.then?t.then(void 0,n):t}var n=require("./connectionDB"),t=function(e,n){return"select query_id,\n                   proposito,\n                    sql_sentence\n            from "+e+"."+n+"\n    where query_id = $1"};module.exports=function(r,o,u,i,c){try{var f,s=function(e){return f?e:{CODIGO_RETORNO:6,MENSAJE_RETORNO:"No se logro emsamblar el query",DATA:{}}},l=[],h=r,a=null;r||(a=new n,h=a.getConnection());var m=function(n,r){try{var s=e(function(){if(o&&u&&i&&c)return Promise.resolve(function(n,r,o,u){try{return Promise.resolve(e(function(){var e={name:"fetch-query-template",text:t(r,o),values:[u]};return Promise.resolve(n.query(e)).then(function(e){return e.rows[0]})},function(e){throw e}))}catch(e){return Promise.reject(e)}}(h,o,u,i)).then(function(e){return e&&e.sql_sentence&&Object.getOwnPropertyNames(c).forEach(function(e,n,t){c[e]&&l.push(c[e])}),function(){if(l.length>0)return Promise.resolve(h.query({name:"fetch-sql-"+i,text:e.sql_sentence,values:l})).then(function(e){if(e)return f=1,{CODIGO_RETORNO:0,MENSAJE_RETORNO:"OK",DATA:e.rows}})}()})},function(e){throw e})}catch(e){return r(!0,e)}return s&&s.then?s.then(r.bind(null,!1),r.bind(null,!0)):r(!1,s)}(0,function(e,n){function t(){if(e)throw n;return n}var r=function(){if(a)return Promise.resolve(a.closeConnection()).then(function(){})}();return r&&r.then?r.then(t):t()});return Promise.resolve(m&&m.then?m.then(s):s(m))}catch(e){return Promise.reject(e)}}});
//# sourceMappingURL=dinamicQuery.umd.js.map
