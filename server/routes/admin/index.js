module.exports = app => {
    const express = require("express")
    const jwt = require('jsonwebtoken')
    
    const assert = require('http-assert')

    const router = express.Router({
        mergeParams:true
    })

    //日志配置
    const Log = require('../../models/mobile/log')
    const logConfig = require('../../middleware/logConfig')
    // const Users = require('../../models/Users')
    //通用增加数据接口
    router.post('/',async(req,res)=>{

        const model = await req.Model.create(req.body)
        res.send(model)
    })

    //通用修改数据接口
    router.put('/:id',async(req,res)=>{
        const model = await req.Model.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
        if(req.Model.modelName==='Article'){
            const logs = logConfig(req,'修改文章操作')
            await Log.create(logs)
        }
    })

    //通用删除数据接口
    router.delete('/:id',async(req,res)=>{
        await req.Model.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
        if(req.Model.modelName==='Article'){
            const logs = logConfig(req,'删除文章操作')
            await Log.create(logs)
        }
    })

    //通用获取数据接口
    router.get('/' ,async(req,res)=>{
        const queryOptions = {}
        // console.log(req.Model)
        if(req.Model.modelName==='User'){
            queryOptions.populate='relative'
            } else if(req.Model.modelName==='Article'){
                // console.log(req.Model.modelName)
                queryOptions.populate= {
                    path:'relative',
                    select:'className _id'
                }
            }
                const items = await req.Model.find().setOptions(queryOptions)
                res.send(items)
    })

    //通用获取数据接口 带分页
    router.get(`/:numPage/:numSize` ,async(req,res)=>{
        const count = await req.Model.countDocuments()
        //前端传入页数
        let Page = Number(req.params.numPage) || 1;
        //前端传入每页条数
        let Size = Number(req.params.numSize)|| 1;
        //计算总页数
        let allPages = Math.ceil(count/Size);
        //当前页不能大于总页数
        Page = Math.min(Page,allPages)
        //当前页不能小于1
        Page = Math.max(Page,1)
        //忽略数
        let skip = (Page-1)*Size;
        const queryOptions = {}
        // console.log(req.Model.modelName)
        if(req.Model.modelName==='User'){
            queryOptions.populate='relative'
            }else if(req.Model.modelName==='Plan'){
                // console.log('111')
                queryOptions.populate={
                    path:'planmaker',
                    select:'makername _id makericon'
                }
            } else if(req.Model.modelName==='Article'){
                queryOptions.populate='relative'
            }
                const items = await req.Model.find().setOptions(queryOptions).skip(skip).limit(Size)
                BeanPage = {
                    count,
                    Page,
                    Size,
                    allPages
                }
                res.send({items,BeanPage})
                if(req.Model.modelName==='Article'){
                    const logs = logConfig(req,'查看文章列表操作')
                    await Log.create(logs)
                }
                
    })
    //通用根据id获取数据接口
    router.get('/:id',async(req,res)=>{
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    // const authMiddleware = require('../../middleware/auth')
    

    // const resourceMiddleware = require('../../middleware/resource')
    //动态获取不同model类型的接口的封装入口
    const AdminUser = require('../../models/AdminUser')
    app.use('/admin/api/rest/:resource',async (req,res,next)=>{
        
        const token = await String(req.headers.authorization || '').split(' ').pop()
        assert(token,401,'请先登录') 
        const {id} = await jwt.verify(token,req.app.get('secret'))
        assert(id,401,'请先登录')         
        req.user = await AdminUser.findById(id)
        assert(req.user,401,'请先登录') 
        await next()
    }, async (req,res,next)=>{
        const ModelName = require('inflection').classify(req.params.resource) //转类名的中间件操作
        // console.log(ModelName)
        req.Model = require(`../../models/${ModelName}`)
        await next()
    } ,router)

   
    const multer = require('multer') //上传文件所需的中间件，帮忙做了很多处理
    const upload = multer({dest:__dirname + '/../../uploads'})
    app.post('/admin/api/upload', async (req,res,next)=>{
       
        const token = await String(req.headers.authorization || '').split(' ').pop()
        assert(token,401,'请先登录') 
        const {id} = await jwt.verify(token,req.app.get('secret'))
        assert(id,401,'请先登录')         
        req.user = await AdminUser.findById(id)
        assert(req.user,401,'请先登录') 
        await next()
    },upload.single('file') ,async (req,res)=>{
        const file = req.file
        file.url=`http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/origin',async(req,res)=>{
        const {adminName} = req.body
        const num = await AdminUser.countDocuments()
        if(num===0&&adminName){
            await AdminUser.create(req.body)
            res.send({message:'创建成功'})
        } else
        res.send(num)
    })

    app.post('/admin/api/login', async (req,res) =>{
        const { adminName,password }= req.body
        //根据用户名找到用户
        const user = await AdminUser.findOne({adminName}).select('+password')
        assert(user,422,'用户不存在') //等价下面的
        // if(!user){
        //     return res.status(422).send({message:'用户不存在'})
        // }
        
       if(user.password!==password){
            return res.status(422).send({message:'密码错误'})
        }
        //返回token
        const token = jwt.sign({id:user._id},app.get('secret'))
        return res.send({token:token,user})
    })

    //错误处理函数
    app.use(async(err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message:err.message
        })
    //   await next()   
    })
}