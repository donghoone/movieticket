var express = require('express');
var app = express();
var fs = require('fs');
var url =require('url');
var test1 = require('./template.js')
var async = require('async');
var mysql      = require('mysql');
var qs = require('querystring');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
//app.use('/pu', express.static('./public/javascripts'))
app.use('/p', express.static('./'))
app.use(cookieParser());
var log=`        <a href="/login">
          <input type="button" name="logbtn" value="login">
          </a>`;


// 비밀번호는 별도의  파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var db = mysql.createConnection({
//var db = new mysql({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'mydb'
});
app.use(bodyParser.urlencoded({ extended: true }));
db.connect();


function godb(idx){
  db.query(`SELECT * FROM testhall where testmovie_movieidx = ?`,[idx], function(error, inf, fields){
    console.log('qq');
  });
}

function loginstate(req, res){
  var s='';
  db.query(`select * from testmovie`,function(err,inf){
    for(var i in inf){
      s+= `<img src="${inf[i].poster}" width="300" height="400">`
    }
          console.log(s);

  log =`<a href="/login">
            <input type="button" name="logbtn" value="login">
            </a>
            </div>
          </li>
          <ul>
          ${s}

          </ul>
          </body>
          </html>`;
  if(req.headers.cookie){
    log=`<a href="/log-out">
              <input type="button" name="logbtn" value="logout">
              </a>
              </div>
            </li>

            <ul>

${s}
            </ul>

            <div class =logstl2>

            <a href = "/choicemovie">
              <input type="button" value="영화예매">
            </a>
            <a href = "/check">
              <input type="button" value="나의 예약목록">
            </a></div>
            </body>
            </html>`;
  }
});
  return log;

}
//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
app.get('/', function(req, res) {
/*
  console.log(req.headers.cookie);
  if(req.headers.cookie){
  log=`        <a href="/log-out">
            <input type="button" name="logbtn" value="logout">
            </a>`;
  }
  else if(req.headers.cookie==undefined){
    `        <a href="/login">
              <input type="button" name="logbtn" value="login">
              </a>`;
  }*/
    html = test1.HTML(`<!doctype html>
    <html>
    <head>
      <title>MOVIE</title>
      <meta charset="utf-8">
      <style>
    .moviepost {
       list-style:none;
       float: left;
     padding-left:15px;
       }
      .logstl {
        list-style:none;
        float: right;
        padding-left:15px;
          }
          .logstl2 {
            list-style:none;
            float :right;

              }
        .tt{
          text-align: center;
        }
    </style>

    </head>
    <body>
    <li>  <div class="tt">
      <h1>상영중 영화</h1>
    </div>
      <div class="logstl">`,
      loginstate(req,res)
)

    return res.send(html);
});

app.get('/login', function(req, res) {
  return res.send(`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>로그인</title>
    </head>
    <body>
    <form action="/log-in" method ="post">
      <div>아이디 : <br/><input type="text" name="id" value=""></div>
      <div>비밀번호: <br/><input type="password" name="pwd" value=""></div>
      <div><input type="submit"  value="로그인"></div>
      </form>
      <br>
      <div>
      <a href = "/Signup">
      <input type="submit" name="Sign-up"  value="회원가입">
      </a>
      </div>
    </body>
  </html>
`);
});

app.post('/log-in',function(req,res){

  db.query(`SELECT * FROM testid`, function(error, inf, fields){
    if (error) {
    return res.send('sorry');
} for(var i in inf){
  if (req.body.id== inf[i].id&&req.body.pwd==inf[i].pw) {
    if(inf[i].ididx==0){
      return res.redirect("/host");
    }
    res.cookie("user", inf[i].ididx , {
    expires: new Date(Date.now() + 900000),
    httpOnly: true
});
      return res.redirect("/");
  }
}
    return res.redirect("/login");
  });
});

app.get('/log-out',function(req,res){
  res.clearCookie('user');
  return res.redirect("/");
});

app.get('/Signup', function(req, res){
  return res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>회원가입</title>
    </head>
    <body>
    <form action="/sign-up" method ="post">
      <div>아이디 : <input type="text" name="id" value=""> </div>
      <div>비밀번호 : <input type="password" name="pwd" value=""></div>
      <div><input type="submit" name="Sign-up"  value="가입하기"></div>
    </form>
    </body>
  </html>
`);
});

app.post('/sign-up',function(req,res){
  var k=0;
  db.query(`SELECT * FROM testid`, function(error, inf, fields){
    if (error) {
    return res.send('sorry');
} for(var i in inf){

  if (req.body.id== inf[i].id) {
      return res.redirect("/Signup");
  }
  k=inf[i].ididx;


}
db.query("INSERT INTO testid VALUES (?,?,? )",[++k, req.body.id, req.body.pwd], function (error, res) {
  if (error) throw error;
});


  });

        return res.redirect("/login");

});


app.get('/choicemovie',function(req,res){
console.log(req.cookies.user);
  var _url = req.url;
  var qd= url.parse(_url,true).query;
  var state=1;
  var a;
  if (qd.id===undefined){
  db.query(`SELECT * FROM testmovie `, function(error, inf, fields){
    var list = test1.LIST(inf);
    a= list;
  //  console.log(list);
    var html = test1.TIME(list,"","");

    res.end(html);
  });
}else {
  if(qd.idx===undefined){
  db.query('select * from testhall where  testmovie_movieidx = ?',[qd.id], function(err,inf){

    var list = test1.HALL(inf,qd.id);

     var html = test1.TIME("",list,"");
      //console.log(html);
     res.end(html);
  });
}
else {
db.query(`select *from testhall as h, testseat as s where h.hallidx=s.testhall_hallidx and h.hallidx =? `,[qd.idx], function(err,inf){
  //console.log(inf);
  //var list =test1.SEAT2(inf);
  //db.query('select fullseat from testhall where hallidx =?',[qd.idx], function(err,inf){
  console.log('zzz');
  console.log(inf);
  var a = test1.LIST(inf);
  var b = test1.HALL(inf,qd.id);
  var list = test1.SEAT(inf[0].fullseat,qd.id,qd.idx,req.header.cookie);
//  console.log(inf);
var disable =test1.disa(inf);
  var html = test1.TIME(list,"",disable)//'$('#checkbox option[value=3]').prop(disabled);')
//  var html2 = test1.TIME2(a,b,list,disable); 나중에 출력값 수정하기
    res.end(html);
  });
}
  }


});

app.post('/ing',function(req,res){ //insert문 쓰면 될 거 가틈;
  console.log('test');
console.log(req.body.box);
console.log(req.body);
//  console.log(req.body.box[0]);
  //  (function(n){
  var k=0;
  var l=0;
  var p=0;
//  for (var i = 0; i < req.body.box.length; i++) {
    db.query('select * from testseat', function(err, inf){
      for(var j in inf){
        k=inf[j].seatidx;
//      console.log(req.body);
        }
        console.log('inf 실행');
        //for (var n = 0; n < req.body.length; n++) {
  //        db.query('select * from testseat', function(err, inf2){

        db.query('insert into testseat values (?,?,?)',[++k, req.body.box, req.body.hall],function(err,inf2){
          if (err) throw err;
          console.log('inf2 실행');
        //  console.log(n);
        //  db.query('select * from testseat', function(err, inf3){

  db.query('select * from loglog',function(err, inf3) {
            for (var j in inf3) {
              l=inf3[j].ticketidx;
                console.log(inf3[j]);
            }
            console.log('inf3 실행');
            console.log(l);
        //    db.query('select * from testseat', function(err, inf4){
           db.query('insert into loglog values (?,?,?)',[req.body.hall,k,++l],function(err, inf4) {
              if (err) throw err;
              console.log('inf4 실행');

              db.query('select * from testlog',function(err, inf5){

                for(var j in inf5){
                    p= inf5[j].logidx;
                }
                console.log('inf5 실행');
                console.log(req.cookies.user);
                db.query('insert into testlog values(?,?,?)',[++p,req.cookies.user,l],function(err,inf6){
                  if (err) throw err;
                    console.log('완료');
                    return res.redirect("/choicemovie");
                })
              });
            });
          });
        });
        //}
    });

});


app.get('/host',function(req,res){
return res.send(`<html><head></head><body>
  <form action="/viewmovie" method ="post">

    <div><input type="submit" name="bt"  value="상영중인 영화보기"></div>
  </form>
  <form action="/newmovie" method ="post">
    <div>영화추가 : <input type="text" name="nm" value=""> </div>
    <div>포스터 url: <input type="text" name="post" value=""></div>
    <div><input type="submit" name="bt"  value="영화 추가"></div>
  </form>
  <form action="/newhall" method ="post">
    <div>상영관 : <input type="text" name="nh" value=""> </div>
    <div>시간 : <input type="text" name="post" value=""></div>
    <div>영화제목 : <input type="text" name="movie" value=""></div>
    <div><input type="submit" name="bt"  value="영화 추가"></div>
  </form>
  <form action="/delmovie2" method ="post">
    <div>삭제할 영화 인덱스 : <input type="text" name="dm" value=""> </div>
    <div><input type="submit" name="del"  value="영화 삭제"></div>
  </form>

  </body>
  </html>`);
});

app.post('/viewmovie',function(req,res){
  var k='';
  var p='';
  var html='';
  db.query('select * from testmovie' , function(err, inf){
      k=inf;
    db.query('select * from testhall as h, testmovie as m where h.testmovie_movieidx=m.movieidx', function(err,inf2){
      p=inf2;
      k= test1.mov(k);
      p= test1.hl(p);
      console.log(k);

      console.log(p);

      html = test1.TIME2(k,p,'','');
      res.send(html);
    });
  })
});

app.post('/newmovie',function(req,res){
db.query('select * from testmovie',function(err,inf){
  var k=0;
  for(var i in inf){
    k=inf[i].movieidx;
  }
  db.query('insert into testmovie values (?,?,?)',[++k,req.body.nm,req.body.post])

return res.redirect("/host");
});
});

app.post('/newhall',function(req,res){
db.query('select * from testhall',function(err,inf){
  var k=0;
  var n=0;
  for(var i in inf){
    k=inf[i].hallidx;
  }
  db.query('select * from testmovie where title= (?)',[req.body.movie],function(err,inf2){

  db.query('insert into testhall values (?,?,?,?,?)',[++k,req.body.nh,req.body.post,30 ,inf2[0].movieidx]);

  db.query('select * from testseat',function(err,inf3){
    for(var i in inf3){
      n=inf3[i].seatidx;
    }
    //console.log('iiii');
    console.log(n);
    console.log(k);
  db.query('insert into testseat values (?,?,?)',[++n,0,k]);
});
  //db.query('insert into testseat values (?,?,?)')
return res.redirect("/host");
});
});
});

app.post('/delmovie',function(req,res){
  console.log('j');
  console.log(req.body);
  db.query('delete from testlog where loglog_ticketidx = (select ticketidx from loglog where testhall_hallidx =(?)) ',[req.body.idx]);
  db.query('delete from loglog where testhall_hallidx = ? ',[req.body.idx]);
  db.query('delete from testseat where testhall_hallidx = ? ',[req.body.idx]);
  db.query('delete from testhall where hallidx = ? ',[req.body.idx]);

  return res.redirect("/host");
});

app.post('/delmovie2',function(req,res){
/*db.query(`select * from testlog where loglog_ticketidx IN
     (select ticketidx from loglog where testhall_hallidx =
     (select hallidx from testhall where testmovie_movieidx =
     ${req.body.dm}))`,function(err,inf){
       console.log(inf);
     });*/
db.query('delete from testlog where loglog_ticketidx = any(select ticketidx from loglog where testhall_hallidx = any(select hallidx from testhall where testmovie_movieidx = ?))',[req.body.dm],function(err,res){

});

// ,[req.body.dm]);

db.query('delete from loglog where testhall_hallidx = (select hallidx from testhall where testmovie_movieidx = ?) ',[req.body.dm]);
db.query('delete from testseat where testhall_hallidx = (select hallidx from testhall where testmovie_movieidx = ?) ',[req.body.dm]);
db.query('delete from testhall where testmovie_movieidx = ? ',[req.body.dm]);
db.query('delete from testmovie where movieidx = ? ',[req.body.dm]);

  return res.redirect("/host");
});


app.get('/check', function(req, res){
  var data='';
  console.log('sss');

  var k;
db.query(`SELECT * from testlog as t, loglog as l , testmovie as m ,testhall as h ,testseat as s where t.loglog_ticketidx= l.ticketidx and l.testhall_hallidx = h.hallidx and l.testseat_seatidx = s.seatidx and m.movieidx= h.testmovie_movieidx and t.testid_ididx= (?) `,[req.cookies.user], function (error, inf) {
  if (error) throw error;
  console.log(inf);
  var list=test1.CHECK(inf);
  console.log(list);
  var html = test1.TIME(list,'','');
 res.end(html);
});


});





app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});
