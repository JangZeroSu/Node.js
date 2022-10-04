const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');
let puppeteer = require('puppeteer')
const express = require("express")
const app = express()
const ejs = require('ejs')
const router = express.Router()
require('dotenv').config({path: 'mysql/.env'})
const mysql = require('./mysql')
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
app.use(express.static('public'))
app.use('/static', express.static('public'))
app.use(express.static(__dirname + '/public'))
app.use(express.json({
    limit: '100mb'
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// 정적 파일 설정 (미들웨어) 3
app.use(express.static(path.join(__dirname,'/public')));

// ejs 설정 4
app.set('views', __dirname + '\\views');
app.set('view engine','ejs');

// 세션 (미들웨어) 6
app.use(session({
    secret: 'blackzat', // 데이터를 암호화 하기 위해 필요한 옵션
    resave: false, // 요청이 왔을때 세션을 수정하지 않더라도 다시 저장소에 저장되도록
    saveUninitialized: true, // 세션이 필요하면 세션을 실행시칸다(서버에 부담을 줄이기 위해)
    store : new FileStore() // 세션이 데이터를 저장하는 곳
}));
app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/signup', (req, res) => {
    res.render("signup")
})

app.get("/", (req, res) => {
    console.log(req.session);
    if(req.session.is_logined == true){
        res.render('index',{
            is_logined : req.session.is_logined,
            name : req.session.name
        });
    }else{
        res.render('index',{
            is_logined : false
        });
    }
});

app.get('/signup',(req,res)=>{
    console.log('회원가입 페이지');
    res.render('signup');
});

app.post('/signup', async(req,res)=>{
    console.log('회원가입 하는중')
    
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    var age = req.body.age;

    obj = [
        {id:id,
        pw:pw,
        name:name,
        age:age},
    ]
        try
        {
            const re = await mysql.query('userdata_insert',obj) 
            res.send("<script>alert('회원가입 성공하셨습니다,');location.href='/';</script>")
            
        }
        catch(err)
        {
            res.send("<script>alert('중복되는 아이디입니다');location.href='/signup';</script>");
        }

     
});
app.get('/login',async(req,res)=>{
    console.log('로그인 작동');
    res.render('login');
});

app.post('/login',async(req,res)=>{
    var id = req.body.id;
    var pw = req.body.pw;
    try{
        const userlist = await mysql.query('userdata_list',id)
   
        // 로그인 확인
        console.log(id);
        console.log(userlist[0].id);
        console.log(userlist[0].pw);
        console.log(id == userlist[0].id);
        console.log(pw == userlist[0].pw);
        if(id == userlist[0].id || pw == userlist[0].pw){
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            req.session.name = userlist.name;
            req.session.id = userlist.id;
            req.session.pw = userlist.pw;
            req.session.save(function(){ // 세션 스토어에 적용하는 작업
                res.render('index',{ // 정보전달
                    name : userlist[0].name,
                    id : userlist[0].id,
                    age : userlist[0].age,
                    is_logined : true
                });
            });
        }else{
            console.log('로그인 실패');
            res.render('login');
        } 
    }
    catch(err){ 
        res.send("<script>alert('등록되지 않은 사용자입니다.');location.href='/login';</script>");
    }
    
    
    });
    
app.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
    req.session.destroy((err) => {
        // 세션 파괴후 할 것들
        res.redirect('/');
    });

});

app.post('/search', async(req, res) => {
    let search = `${req.body.area}`
    parse(search)
})

app.post('/result', async(req, res) => {
    const bang = await mysql.query('bang_List')

    const obj = []
    for(var i = 0; i < bang.length; i++){
        obj[i] ={
        rent: bang[i].rent,
        area : bang[i].area,
        location : bang[i].location    
    }}   
    res.render('result',{data: obj})
})

async function parse(search)
{
    const truncate = mysql.query('bang_truncate')
    let browser = await puppeteer.launch({headless: false})
    let page = await browser.newPage()
    await page.goto('https://www.zigbang.com/home/oneroom/map')

    await page.type("div.input-wrap > input", search)
    await wait(1000)
    page.click('div.search-input-liner div.btn-search-wrap button.btn-search')

    await wait(2500)

    let result = await page.$$eval('div.r-eqz5dr.r-1wbh5a2.r-1777fci div.css-1563yu1', names => names.map(name => name.textContent))
    let resu = result
    await wait(1000)
    for(var i = 0; i < resu.length; i++){ 
        if (resu[i] == "추천") { 
          resu.splice(i, 1)
          i--
        }
    }
    for(var i=0; i < resu.length/5; i++)
    {
        obj = {
            rent: resu.slice(5*i+1,5*i+2),
            area: resu.slice(5*i+2,5*i+3),
            location: resu.slice(5*i+3,5*i+4)
        }
        console.log(obj)
        const re = mysql.query('bang_Insert', obj)
    }
    browser.close()
}

app.listen(3000, () => {
    console.log("Listening on Port : 3000")
})

app.post('/chart', async(req, res) => {
    const bang = await mysql.query('bang_chart')
    const obj = []
    for(var i = 0; i < bang.length; i++){
        obj[i] ={
        rent: bang[i].월세,
        area : bang[i].평수_층,
        location : bang[i].지역,    
        size: bang[i].크기
    }}   
    res.render('chart',{data: obj})    
})