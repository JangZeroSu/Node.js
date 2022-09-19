let puppeteer = require('puppeteer')

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

app.get('/result', async(req, res) => {
    const coupang = await mysql.query('coupangList')
    console.log(coupang)
    var i
    const obj = []
    for(i = 0; i < coupang.length; i++){
        obj[i] ={
        name: coupang[i].name,
        price : coupang[i].price        
    }}   
    res.render('result',{data: obj})
})

async function parse()
{
    let browser = await puppeteer.launch({headless: false})
    let page = await browser.newPage()
    
    page.setViewport
    ({
        width: 1920,
        height:1080
    })

    await page.goto('https://www.coupang.com/np/campaigns/82')

    
    let eh_list = await page.$$('li.baby-product')   // 복수

    for(let eh of eh_list){
        let title = await eh.$eval('div.name', function(el){
            return el.innerText
        })
    
        let price = await eh.$eval('strong', function(el){
            return el.innerText
        })
    
        obj = {       
            name : title,
            price : price          
        }
        console.log(obj)      
    
        const result = await mysql.query('coupangInsert', obj)            
    }
    browser.close()
}
parse()




