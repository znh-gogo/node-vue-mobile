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
app.use('/uploads',express.static(__dirname+'/uploads')) //开放公共资源文件
app.set('secret','TOKEN') //设置token的密钥
require('./routes/admin/index')(app) //引用路由
require('./routes/mobile/index')(app)
require('./plugins/db')(app)  //引用数据库

const port = 3000
app.listen(port)
console.log(`Sever is Starting now...
 ${require('chalk').red(`
 
  __  __                            _   
 |  \\/  | ___  _ __ ___   ___ _ __ | |_ 
 | |\\/| |/ _ \\| '_ \` _ \\ / _ \\ '_ \\| __|
 | |  | | (_) | | | | | |  __/ | | | |_ 
 |_|  |_|\\___/|_| |_| |_|\\___|_| |_|\\__|
                                        
 `)} 

completed.

server is listening on PORT ${port}.
`)