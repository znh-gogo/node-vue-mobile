module.exports = app => {
    const express = require("express")
    const jwt = require('jsonwebtoken')
    
    const assert = require('http-assert')
    const { Imgverify } = require('../../middleware/base.js')
    const router = express.Router({
        mergeParams:true
    })

    //登陆图形校验码

    var vetifys = null
    app.get('/photoVerify',async (req,res,next)=>{
        const result = await Imgverify(req,res);
        // console.log(req.session.Imgverifys)
        vetifys = req.session.Imgverifys//这个session再下面拿不到只能定义一个变量去拿了
        if(result){
            res.send(result);
        }
    })

    //账户注册、登陆
    const Account = require('../../models/mobile/Account')
    router.post('/register',async (req,res) => {
        const { account,verify }= req.body
        
        //根据用户名找到用户
        const userExit = await Account.findOne({account})
        if(userExit){
            return res.status(422).send({message:'用户已存在'})
        } 
         //验证码校验
         else if(verify !== vetifys){
                    return res.status(422).send({
                        message:'验证码错误'
                    })
                }
        const model = await Account.create(req.body)
        res.send({model,message:'注册成功'})
    })
    
    router.post('/login',async (req,res,next)=>{
        const { account,password,verify }= req.body
        //根据用户名找到用户
        // console.log(vetifys)
        
        const user = await Account.findOne({account}).select('+password')
        assert(user,422,'用户不存在') //等价下面的
        // if(!user){
        //     return res.status(422).send({message:'用户不存在'})
        // }
        if(user.frozen !== 1){
            return res.status(422).send({message:'账号被冻结'})
        }
        if(user.password!==password){
                return res.status(422).send({message:'密码错误'})
        }
        //验证码校验
        if(verify !== vetifys){
            return res.status(422).send({
                message:'验证码错误'
            })
        }
        //返回token
        const token = jwt.sign({id:user._id},app.get('secret'))
        return res.send({
            token:token,
            message:'登陆成功',
            user
        })
    })

    //判断是否有token
    const AdminUser = require('../../models/AdminUser')

    const solveAdminToken = async (req,res,next)=>{
        const token = await String(req.headers.authorization || '').split(' ').pop()
        assert(token,401,'请先登录') 
        const {id} = await jwt.verify(token,req.app.get('secret'))
        assert(id,401,'请先登录')         
        req.user = await AdminUser.findById(id)
        assert(req.user,401,'请先登录') 
        await next()
    }

    const solveMobileToken = async (req,res,next)=>{
        const token = await String(req.headers.authorization || '').split(' ').pop()
        assert(token,401,'请先登录') 
        const {id} = await jwt.verify(token,req.app.get('secret'))
        assert(id,401,'请先登录')         
        req.user = await Account.findById(id)
        assert(req.user,401,'请先登录') 
        await next()
    }

    //admin端获取列表信息
    app.get('/admin/api/AccountList/:numPage/:numSize',solveAdminToken ,async(req,res)=>{
        const count = await Account.countDocuments()
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
        const items = await Account.find().skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })
    //删除账户
    app.delete('/admin/api/AccountDel/:id',solveAdminToken,async(req,res)=>{
        await Account.findByIdAndDelete(req.params.id,req.body)
        res.send({
            success:true
        })
    })

    //冻结解冻账号
    app.post('/admin/api/frozenAccount',solveAdminToken,async (req,res)=>{
        const { frozen, id } = req.body
        await Account.findByIdAndUpdate(id,{$set:{frozen}})
        res.send({
            message:'操作成功'
        })
    })

    //回显示用户信息
    router.post('/showAccount/:id',solveMobileToken,async (req,res)=>{
        const model = await Account.findById(req.params.id,'-password')
        res.send(model)
    })

    //更改nickname
    router.post('/updateNickname',solveMobileToken,async (req,res)=>{
        const { nickname, id } = req.body
        await Account.findByIdAndUpdate(id,{$set:{nickname}})
        res.send({
            message:'修改成功'
        })
    })
    //更改telephone
    router.post('/updateTelephone',solveMobileToken,async (req,res)=>{
        const { id, telephone } = req.body
        await Account.findByIdAndUpdate(id,{$set:{telephone}})
        res.send({
            message:'修改成功'
        })
    })
    //更改email
    router.post('/updateEmail',solveMobileToken,async (req,res)=>{
        const { id, email } = req.body
        await Account.findByIdAndUpdate(id,{$set:{email}})
        res.send({
            message:'修改成功'
        })
    })
    //更改description
    router.post('/updateDescription',solveMobileToken,async (req,res)=>{
        const { id, description } = req.body
        await Account.findByIdAndUpdate(id,{$set:{description}})
        res.send({
            message:'修改成功'
        })
    })
    //更改密码
    router.post('/updatePassword',solveMobileToken,async (req,res)=>{
        const { id, newpassword, oldpassword } = req.body
        const user = await Account.findById(id)
        if (oldpassword === user.password){
            await Account.findByIdAndUpdate(id,{$set:{newpassword}})
            res.send({
                message:'修改成功'
            })
        } else 
        res.status(422).send({
            message:'原密码错误'
        })

    })
    //更改头像
    router.post('/updateHeadimg',solveMobileToken,async(req,res)=>{
        const { id, headImg } = req.body
        await Account.findByIdAndUpdate(id,{$set:{headImg}})
        res.send({
            message:'修改成功'
        })
    })

    const Topic = require('../../models/mobile/Topic')
    const Comment = require('../../models/mobile/Comment')
    //发表话题
    router.post('/sendtopic',solveMobileToken,async(req,res)=>{
        const model = await Topic.create(req.body)
        res.send({
            message:'发布成功',
            model
        })
    })

    //查看话题
    router.post('/checktopic',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        const model = await Topic.find({relative:id}).populate('relative topiccomment commentuser')
        res.send(model)
    })

    //查看所有的话题
    router.post('/topiclist',solveMobileToken,async(req,res)=>{
        const model = await Topic.find().populate('relative thinkgood').populate({path:'topiccomment',populate:{path:'commentuser'}})
        res.send(model)
    })

    //对话题进行评论
    router.post('/comment',solveMobileToken,async(req,res)=>{
        const comment = await Comment.create(req.body)
        const savecommentid = await Topic.findByIdAndUpdate(req.body.topicid,{$push:{topiccomment:comment._id}}).populate('relative topiccomment')
        res.send({
            message:'评论成功'
        })
    })

    //点赞话题 
    router.post('/thinkgood',solveMobileToken,async (req,res)=>{
        const { userid, topicid } = req.body
        const user = await Topic.findById(topicid,{thinkgood:userid})
        // console.log(user.thinkgood[0] == userid)
        for(let i = 0; i<user.thinkgood.length;i++){
        if(user.thinkgood[0] == userid){
            var model =  await Topic.findByIdAndUpdate(topicid,{$pull:{thinkgood:userid}})
            res.send(model)
            return
        }
        }
        var model = await Topic.findByIdAndUpdate(topicid,{$push:{thinkgood:userid}})
        res.send(model)
    })

    //删除话题
    router.post('/deltopic',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Topic.findByIdAndDelete(id)
        res.send({
        message:"删除成功"
        })
    })

    //删除评论
    router.post('/delcomment',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Comment.findByIdAndDelete(id)
        res.send({
        message:"删除成功"
        })
    })

    //上传文件中间处理
    const multer = require('multer') //上传文件所需的中间件，帮忙做了很多处理
    const upload = multer({dest:__dirname + '/../../uploads'})
    router.post('/upload', solveMobileToken,
    upload.single('file') ,async (req,res)=>{
        const file = req.file
        file.url=`http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    app.use(async(err,req,res,next)=>{
        res.status(err.statusCode || 500).send({
            message:err.message
        })
    //   await next()   
    })

    app.use('/mobile/api', router)
}