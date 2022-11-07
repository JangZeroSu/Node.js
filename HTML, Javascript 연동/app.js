var express = require('express');  
var app = express();  

app.set('view engine', 'ejs');  //html template을 ejs로 사용하겠습니다.
app.set('views', './views');    //views 폴더를 ./views로 지정하겠습니다.  
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');  
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', (req, res) => {
    res.send('Javascript와 HTML 연동방법');
})

app.get('/result', urlencodedParser, (req, res) => {
    
    req.body.name = '홍길동'
    req.body.title = '홍길동전 제목 입니다.'
    req.body.content = '홍길동전 내용 입니다.'
    obj = {
        name: req.body.name,
        title: req.body.title,
        content: req.body.content
    } 
    //res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }) //한글처리
    //console.log(obj)
    res.render('index', {data: obj})
    
});

app.listen(3000, function () {    
    console.log("서버 시작 3000")  
});
