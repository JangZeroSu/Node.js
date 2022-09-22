var express = require('express');  
var app=express();  

app.set('view engine','ejs')    // html template을 ejs로 사용
app.set('views','./views')        // views폴더를 ./views로 지정

app.use(express.static(__dirname + '/public'))

app.get('/',(req, res) => {  
    res.render('board')
})

app.get('/result',(req, res) => {  
    res.render('board_result', {
        name: req.query.name,
        title: req.query.title,
        content: req.query.content
    })
    console.log(m_name)
})

var server = app.listen(5000, function () {  
    var host = server.address().address  
    var port = server.address().port  
    console.log("서버 시작 http://%s:%s", host, port)  
  }) 
