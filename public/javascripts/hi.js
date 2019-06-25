var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'mydb'
});
db.connect();

function BB(x){
  db.query(`SELECT * FROM testhall where testmovie_movieidx =?`,[x], function(error, inf, fields){
    if (error) {
    return res.send('sorry');
  }
  for(i in inf){
    console.log(inf[i].hallidx);
  }
  });


}
