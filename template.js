var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'mydb'
});
db.connect();
module.exports = {
  HTML:function(before, fn){
    return `
${before}
${fn}
`;
},
TIME:function(a,b,c) {
  return `
  <html>
  <meta charset="utf-8">
  <head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script>
  $(function(){
  ${c}
  })
  </script>
  <style>
  ul { list-style: none; }
  </style>
  </head>
  <body>
  ${a}${b}
  <a href = "/check">
    <input type="button" value="나의 예약목록">
  </a>
  </body>
  </html>`;
},
LIST:function(x){
  console.log(x);
  var list =`<ul> `;
  var j=0
  while (j<x.length) {
    list+=`<img src="${x[j].poster}" width="300" height="400">`
    j++;
  }

  var i=0;
  while(i<x.length){
    list =list+`<li><a href="/choicemovie/?id=${x[i].movieidx}">${x[i].title}</a><li>`;
    i++;
  }
  list =list +'</ul>';
  return list;
},
HALL:function(x,y){
  var list ='<ul>';
  var i=0;
  while(i<x.length){
    list = list + `<li><a href="/choicemovie/?id=${y}&idx=${x[i].hallidx}">${x[i].hall}관 ${x[i].time}</a><li>`;//`<li><form action = /choicemovie/?id=${y}/${x[i].hallidx} method="post"><input type="submit" name="hall"  value="${x[i].hall}관 ${x[i].time}"><form><li>`//`<li><a href="a href="/=${x[i].hallidx}">${x[i].hall}관 ${x[i].time}</a><li>`;
    i++;
  }
  list=list+'</ul>';
  return list;
},SEAT2:function(x){
    var list=' <form id="checkbox" action="/ing" method="post">';
    var i=0;
    var j=0;

    for (var i = 0; i < x[0].fullseat; i++) {
      list += `<input type='moviechk' name='box' value=${i} />`
    j++;
    if (j==5){
      list+='<br>';
      j=0;
    }
    }
    list+=` <input type="submit" id= 'hi' name="ing~"  value="예매하기">
            </form>`
    return list;
}
,SEAT:function(x,y,z,a){
  //console.log(x,y,z);
  var list = ''
  list +=` <form id="checkbox"  action='/ing' method='post'>
  <input type="hidden" name="id" value=${y}>
  <input type="hidden" name="hall" value=${z}>
  <input type =hidden name="hi" value=${a}>
`;
  var j=0;

for (var i = 0; i < x; i++) {
  list += `<input type='checkbox' name ='box' id=${i} value=${i}  >`
j++;
if (j==5){
  list+='<br>';

  j=0;
}
}
  list+=`
  <input type="submit" name="ing~"   value="예매하기">
          </form>`
  return list;
}, disa:function(x) {
  var list ='';
  for (var i = 0; i < x.length; i++) {
    //x[i].seat
  //  console.log(list);
    list += `$("#${x[i].seat}").attr('disabled',true);`
  }

  return list;
},
TIME2:function(a,b,d,c) {
  return `
  <html>
  <meta charset="utf-8">
  <head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script>
  $(function(){
  ${c}
  })
  </script>
  <style>
  ul { list-style: none; }
  </style>
  </head>
  <body>
  ${a}${b}${d}

  </body>
  </html>`;
},CHECK:function(x){
  var list='<ul>';
  for (var i = 0; i < x.length; i++) {
  list +=`<div>고객님이 예매한 영화는 ${x[i].title}이며 ${x[i].time} 에 ${x[i].hall}관에서 방영되며 ${x[i].seat}번 좌석입니다.<div>`;
}
list+='</ul>'
return list;


},mov:function(x){
  var list='현재 상영중인 영화 : ';
  var i=0;
  while(i<x.length){
    list+=`${x[i].movieidx}.${x[i].title}   `
    i++;
  }
  return list;
},hl:function(x){
  var list ='<br>';
  var i=0;
  while(i<x.length){
    list+=`
    <form action="/delmovie" method ="post">
      <div><input type ="hidden" name="idx" value = "${x[i].hallidx}"></div>
      <div>${x[i].title} - ${x[i].hall}관 ${x[i].time} 상영 영화삭제</div>
      <div><input type="submit"  value="삭제"></div>
      </form>
    `
    i++;
  }
  return list;
}


/*
SEAT:function(x){
  var list=' <form id="checkbox" action="/ing" method="post">';
  var i=0;
  var j=0;

for (var i = 0; i < x; i++) {
  list += `<input type='checkbox' name='box' value=${i} />`
j++;
if (j==5){
  list+='<br>';
  j=0;
}
}
  list+=` <input type="submit" name="ing~"  value="예매하기">
          </form>`
  return list;
}*/

}
