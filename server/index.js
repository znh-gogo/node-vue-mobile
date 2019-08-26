const express = require("express")
const session = require('express-session')

const app = express()
app.use(express.json()) 
app.use(session({
    secret:'$session#',
    name:'sessionId',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}));
app.use(require('cors')()) //处理跨域的中间件
app.use('/uploads',express.static(__dirname+'/uploads'))
app.set('secret','TOKEN') //设置token的密钥
require('./routes/admin/index')(app) //引用路由
require('./routes/mobile/index')(app)
require('./plugins/db')(app)  //引用数据库


app.listen(3000,()=>{
    console.log("http://localhost:3000")
})