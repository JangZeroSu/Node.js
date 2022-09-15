const express = require('express')
const ejs = require('ejs')

const app = express();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.json({
    limit: '50mb'
}))

app.listen(3000, () => {
    console.log("Sever Started port 3000...")
}) 

// 1단계 곱하기
app.get('/multiply', function(req, res){
    res.render('multiply')
})
app.post('/multiply/result', async(req, res) => {
    res.send(`${req.body.t1 * req.body.t2}`)
})

// 2단계 사칙연산
app.get('/math_view', function(req, res){
    res.render('math_view')
})
app.post('/math/math_result', function(req, res){
    const obj = 
    [
        {
            result1: `${parseInt(req.body.t1) + parseInt(req.body.t2)}`,
            result2: `${req.body.t3 - req.body.t4}`,
            result3: `${req.body.t5 * req.body.t6}`,
            result4: `${req.body.t7 / req.body.t8}`
        }
    ]
    res.render('math_result', {data: obj});
})
