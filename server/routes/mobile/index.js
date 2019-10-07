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
        const { account,password,verify,autoLogin,authflag }= req.body
        //根据用户名找到用户
        // console.log(vetifys)

        //检验是否自动登陆
        if(autoLogin){
            const user = await Account.findOne({account}).select('+password')
            const token = jwt.sign({id:user._id},app.get('secret'))
            return res.send({
                token:token,
                message:'登陆成功',
                user
            })
        } else if(authflag){ //admin端商家登陆
            const user = await Account.findOne({account}).select('+password')
            if(!user){
                return res.status(422).send({message:'用户不存在'})
            }
            if(user.frozen !== 1){
                return res.status(422).send({message:'账号被冻结'})
            }
            if(user.password!==password){
                    return res.status(422).send({message:'密码错误'})
            }
            const token = jwt.sign({id:user._id},app.get('secret'))
            return res.send({
                token:token,
                message:'登陆成功',
                user
            })
        } else {

        const user = await Account.findOne({account}).select('+password')
        // assert(user,422,'用户不存在') //等价下面的
        if(!user){
            return res.status(422).send({message:'用户不存在'})
        }
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
        }
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

    //更改地址
    router.post('/updateAddress',solveMobileToken,async(req,res)=>{
        const { id, address } = req.body
        await Account.findByIdAndUpdate(id,{$set:{address}})
        res.send({
            message:'修改成功'
        })
    })

    //回显个人余额
    router.post('/showMyMoney',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        const model = await Account.findById(id,'money')
        res.send(model)
    })

    //充值
    router.post('/recharge',solveMobileToken,async(req,res)=>{
        const { id,money } = req.body
        if(money>=10000){
            res.send({
                message:'充值失败，所充值的金额大于9999'
            })
        } else {
            const model = await Account.findById(id,'money')
            let newmoney = parseFloat(model.money) + parseFloat(money)
            await Account.findByIdAndUpdate(id,{$set:{money:newmoney}})
            res.send({
                message:'充值成功'
            })
        }
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
        if(user.thinkgood[i] == userid){
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

    const Communication = require('../../models/mobile/Communication')
    //发送私信
    router.post('/sendprivateletter',solveMobileToken,async(req,res)=>{
        const { comcontent,sendrelative,receiverelative,flag,id } = req.body
        if(flag === 0){
            await Communication.create(req.body)
            res.send({message:'发送成功'})
        } else {
            const model = await Communication.findByIdAndUpdate(id,{$push:{comcontent}})
            res.send({message:'发送成功'})            
        }
    })

    //显示私信回调
    router.post('/showprivateletter',solveMobileToken,async(req,res)=>{
        const { sendrelative,receiverelative } = req.body
        const user = await Communication.find({receiverelative,sendrelative}).populate({path:'comcontent.talker'})
        // console.log(user)
        if(user.length===0){
            res.send({flag:0})
        } else if(user.length!==0){
            res.send(user)
        }
    })

    //显示会话列表
    router.post('/showConversation',solveMobileToken,async(req,res)=>{
        const { sendrelative,receiverelative } = req.body
        const user1 = await Communication.find({sendrelative}).populate({path:'comcontent.talker'}).populate('receiverelative sendrelative')
        const user2 = await Communication.find({receiverelative}).populate({path:'comcontent.talker'}).populate('receiverelative sendrelative')
        const user = user1.concat(user2)
        res.send(user)
    })

    //删除会话/私信/聊天记录
    router.post('/delConversation',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        await Communication.findByIdAndDelete(id)
        res.send({
            message:"删除成功"
        })
    })

    //搜索会话人账号
    router.post('/searchConversation',solveMobileToken,async(req,res)=>{
        const { account,nickname } = req.body
        if(account) {var model = await Account.find({account})}
        else if(nickname) {var model = await Account.find({nickname})}
        if(model.length === 0){
            res.send({
                message:'搜索结果为空'
            })
        } else
        res.send(model)
    })

    const Feedback = require('../../models/mobile/Feedback')
    //发送反馈
    router.post('/feedback',solveMobileToken,async(req,res)=>{
        const model = await Feedback.create(req.body)
        res.send({
            message:'反馈成功',
            model
        })
    })

    //删除反馈
    router.post('/delMyfeedback',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Feedback.findByIdAndDelete(id)
        res.send({
            message:"删除成功"
        })
    })

    //回显我的反馈进度
    router.post('/showMyFeedback',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        const model = await Feedback.find({relative:id}).populate('relative')
        res.send(model)
    })

    //回显我的反馈详情
    router.post('/showMyFeedbackDetail',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Feedback.findById(id)
        res.send(model)
    })

    //admin端获取反馈列表信息
    app.get('/admin/api/FeedbackList/:numPage/:numSize',solveAdminToken ,async(req,res)=>{
        const count = await Feedback.countDocuments()
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
        const items = await Feedback.find().populate('relative').skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })

    //admin端处理反馈事件
    app.post('/admin/api/handleFeedback',solveAdminToken,async(req,res)=>{
        const { id,feedbackflag } = req.body
        await Feedback.findByIdAndUpdate(id,{$set:{feedbackflag}})
        res.send({
            message:'反馈处理成功!'
        })
    })

    const ArticleClass = require('../../models/ArticleClass')
    const Article = require('../../models/Article')
    //mobile端获取pc资讯分类信息
    router.post('/getArticleclass',solveMobileToken,async(req,res)=>{
        const model = await ArticleClass.find()
        res.send(model)
    })

    //通过分类获取该分类的所有文章
    router.post('/getArticle',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        const model = await Article.find({relative:id})
        res.send(model)
    })

    //通过id查询文章详情
    router.post('/newsInfo',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        const model = await Article.findById(id)
        res.send(model) 
    })

    //查询所有文章
    router.post('/getAllNews',solveMobileToken,async(req,res)=>{
        const model = await Article.find().populate('relative')
        res.send(model)
    })

    const GoodCategory = require('../../models/GoodCategory')
    const Product = require('../../models/mobile/Product')

    //商品类别回显
    router.post('/proCategory',solveMobileToken,async(req,res)=>{
        const model = await GoodCategory.find()
        res.send(model)
    })

    //商品发售
    router.post('/saleProduct',solveMobileToken,async(req,res)=>{
        await Product.create(req.body)
        res.send({
            message:'发售成功'
        })
    })

    //回显我的商品详情
    router.post('/showMyProdetail',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Product.findById(id).populate('seller comments.relative')
        res.send(model)
    })

    //编辑商品
    router.post('/editProduct',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Product.findByIdAndUpdate(id,req.body)
        res.send({message:'修改成功'})
    })

    //删除我的商品
    router.post('/delProduct',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Product.findByIdAndDelete(id)
        res.send({message:'删除成功'})
    })

    //回显我的商品列表
    router.post('/showMyProduct',solveMobileToken,async(req,res)=>{
        const {id,numPage,numSize} = req.body

        const count = await Product.countDocuments()
        //前端传入页数
        let Page = Number(numPage) || 1;
        //前端传入每页条数
        let Size = Number(numSize)|| 1;
        //计算总页数
        let allPages = Math.ceil(count/Size);
        //当前页不能大于总页数
        Page = Math.min(Page,allPages)
        //当前页不能小于1
        Page = Math.max(Page,1)
        //忽略数
        let skip = (Page-1)*Size;

        const items = await Product.find({seller:id}).populate('pro_categories').skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })

    //admin端回显所有商品列表
    app.get('/admin/api/showAllProduct/:numPage/:numSize',solveAdminToken,async(req,res)=>{
        const count = await Product.countDocuments()
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
        const items = await Product.find().populate('pro_categories seller').skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })

    //mobile商品列表
    router.post('/MobileProduct',solveMobileToken,async(req,res)=>{
        const {id,numPage,numSize} = req.body
        const count = await Product.countDocuments()
        //前端传入页数
        let Page = Number(numPage) || 1;
        //前端传入每页条数
        let Size = Number(numSize)|| 4;
        //计算总页数
        let allPages = Math.ceil(count/Size);
        //当前页不能大于总页数
        Page = Math.min(Page,allPages)
        //当前页不能小于1
        Page = Math.max(Page,1)
        //忽略数
        let skip = (Page-1)*Size;
        if(numSize*numPage>count){
            const model = []
            res.send(model)
            return
        } else
        if(id){
            const model = await Product.find({pro_categories:id}).populate('seller').skip(skip).limit(Size)
            res.send(model)
        }else {
            const model = await Product.find().populate('seller').skip(skip).limit(Size)
            res.send(model)
        }
    })

    //mobile收藏商品
    router.post('/saveProduct',solveMobileToken,async(req,res)=>{
        const { id,uid } = req.body
        const user = await Product.findById(id,{pro_attention:uid})
        // console.log(user.thinkgood[0] == userid)
        for(let i = 0; i<user.pro_attention.length;i++){
        if(user.pro_attention[i] == uid){
            var model =  await Product.findByIdAndUpdate(id,{$pull:{pro_attention:uid}})
            res.send(model)
            return
        }
        }
        var model = await Product.findByIdAndUpdate(id,{$push:{pro_attention:uid}})
        res.send(model)
    })

    //商品留言
    router.post('/ProLeaving',solveMobileToken,async(req,res)=>{
        const {id,comment,cid} = req.body
        await Product.findByIdAndUpdate(id,{$push:{comments:{'com_content':comment,'relative':cid}}})
        res.send({message:'留言成功'})
    })

    //删除商品留言
    router.post('/delLeaving',solveMobileToken,async(req,res)=>{
        const {id,cid} = req.body
        await Product.findByIdAndUpdate(id,{$pull:{comments:{'_id':cid}}})
        res.send({message:'删除留言成功'})
    })

    //我关注得商品
    router.post('/mySavePro',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Product.find({pro_attention:id}).populate('seller')
        res.send(model)
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