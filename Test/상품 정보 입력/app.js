const express = require('express')

require('dotenv').config({path: 'mysql/.env'})

const mysql = require('./mysql')
const ejs = require('ejs')
const app = express()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.json({
    limit: '50mb'
}))

app.listen(3000, () => {
    console.log("Server Started port 3000...")
})

app.get('/', function(req, res){
    res.render('buy')
})

app.post('/buy/insert', async(req, res) => {   
    obj = {       
        name : req.body.name,
        product : req.body.product,
        buytime : new Date()
    }
    console.log(obj)
    req.body.param = obj

    const result = await mysql.query('buyInsert', req.body.param)
    res.send('처리되었습니다.')
})

app.post('/result', async(req, res) => {
    const purchase_time = await mysql.query('buyList')
    console.log(purchase_time)
    var i
    const obj = []
    for(i = 0; i < purchase_time.length; i++){
        obj[i] ={
        id : purchase_time[i].id,
        name: purchase_time[i].name,
        product: purchase_time[i].product,
        buytime: purchase_time[i].buytime
    }}   
    res.render('result',{data: obj})
})
