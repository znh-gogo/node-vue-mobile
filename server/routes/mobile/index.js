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
        if(req.user.frozen !== 1){
            res.status(422).send({message:'账号被冻结'})
        }
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

    //回显个人收货地址
    router.post('/showReAddress',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Account.findById(id,'rece_info')
        res.send(model)
    })

    //添加个人收货地址
    router.post('/addReAddress',solveMobileToken,async(req,res)=>{
        const {id,re_name,re_phone,re_address} = req.body
        const model = await Account.findByIdAndUpdate(id,{$push:{'rece_info':{re_name,re_phone,re_address}}})
        res.send({message:'添加成功'})
    })
    
    //修改个人收货地址
    router.post('/updateReAddress',solveMobileToken,async(req,res)=>{
        const {rid,re_name,re_phone,re_address} = req.body
        await Account.update({'rece_info._id':rid},{$set:{'rece_info.$.re_name':re_name,'rece_info.$.re_phone':re_phone,'rece_info.$.re_address':re_address}})
        res.send({message:'修改成功'})
    })

     //删除个人收货地址
     router.post('/delReAddress',solveMobileToken,async(req,res)=>{
        const {id,rid} = req.body
        const model = await Account.findByIdAndUpdate(id,{$pull:{'rece_info':{'_id':rid}}})
        res.send({message:'删除成功'})
    })

    //设置为默认收货地址
    router.post('/defaultReAddress',solveMobileToken,async(req,res)=>{
        const {id,rid,flag} = req.body
        if(flag===0){
            await Account.update({'rece_info._id':rid},{$set:{'rece_info.$.checked':flag}})
            res.send({message:'取消默认成功'})
            return
        }
        const model = await Account.findById(id,'rece_info')
        for(let i = 0;i<model.rece_info.length;i++){
            if(model.rece_info[i].checked == 1){
                res.send({message:'已经存在默认地址，请先取消'})
                return
            }
        }
        await Account.update({'rece_info._id':rid},{$set:{'rece_info.$.checked':1}})
        res.send({message:'设置默认成功'})
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

    //回显是否已经设置支付密码标识
    router.post('/showIfPaypassword',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Account.findById(id,'paypassword')
        if(model.paypassword){
            res.send({paypasswordflag:true})
        } else{
            res.send({paypasswordflag:false})
        }
    })

    //设置支付密码
    router.post('/setPaypassword',solveMobileToken,async(req,res)=>{
        const {id,paypassword} = req.body
        await Account.findByIdAndUpdate(id,{$set:{paypassword}})
        res.send({message:'设置支付密码成功'})
    })

    //修改支付密码
    router.post('/updatePaypassword',solveMobileToken,async(req,res)=>{
        const {oldpaypassword,newpaypassword,id} = req.body
        const model = await Account.findById(id,'paypassword')
        if(oldpaypassword === model.paypassword){
            await Account.findByIdAndUpdate(id,{$set:{paypassword:newpaypassword}})
            res.send({message:'支付密码修改成功',status:200})
        } else {
            res.send({message:'原支付密码错误',status:401})
        }
    })

    //验证支付密码
    router.post('/checkPaypassword',solveMobileToken,async(req,res)=>{
        const {id,paypassword} = req.body
        const model = await Account.findById(id,'paypassword')
        if(paypassword === model.paypassword){
            res.send({
                message:'支付密码正确',
                status:200,
            })
        } else {
            res.send({
                message:'支付密码错误',
                status:401,
                model
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

    //文章添加收藏
    router.post('/saveNews',solveMobileToken,async(req,res)=>{
        const {id,uid} = req.body
        const user = await Article.findById(id,{art_attention:uid})
        // console.log(user.thinkgood[0] == userid)
        for(let i = 0; i<user.art_attention.length;i++){
        if(user.art_attention[i] == uid){
            var model =  await Article.findByIdAndUpdate(id,{$pull:{art_attention:uid}})
            res.send(model)
            return
        }
        }
        var model = await Article.findByIdAndUpdate(id,{$push:{art_attention:uid}})
        res.send(model)
    })

    //回显我收藏的文章
    router.post('/showmysaveNews',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Article.find({art_attention:id}).populate('relative')
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

    //商家发货
    router.post('/sendOrderList',solveMobileToken,async(req,res)=>{
        const {id,sendOrderList} = req.body
        await Product.findByIdAndUpdate(id,{$set:{sendOrderList}})
        res.send({message:'操作成功'})
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

        const count = await Product.countDocuments({seller:id})
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

        const items = await Product.find({seller:id}).populate('pro_categories buyer').skip(skip).limit(Size)
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

    //admin删除商品
    app.post('/admin/api/delGood',solveAdminToken,async(req,res)=>{
        const {id} = req.body
        await Product.findByIdAndDelete(id)
        res.send({message:'删除成功'})
    })

    //admin首页数据回显
    app.post('/admin/api/showData',solveAdminToken,async(req,res)=>{
        //用户数量
        const usernum = await Account.countDocuments()
        //商品数量
        const productnum = await Product.countDocuments()
        //文章数量
        const articlenum = await Article.countDocuments()
        //话题数量
        const topicnum = await Topic.countDocuments()
        //商品交易额
        const model = await Product.find({buyflag:2})
        var buynum = 0
        model.map((item)=>{
            buynum = buynum + item.pro_price
        })
        var productcharts = []
        var categorycharts = []
        //商品类型及对应数量
        const productcategory = await GoodCategory.find()
        productcategory.forEach(async(item)=>{
            const value =await Product.find({pro_categories:item._id})
            const num =await parseInt(value.length)
            
            productcharts.push({
                value:num,
                name:item.goodcategory
            })
            categorycharts.push(item.goodcategory)
            
        })
        //文章类型及对应数量
        var articlecategory = []
        var articlecharts = []
        const modelcategory = await ArticleClass.find()
        modelcategory.forEach(async(item)=>{
            const value1 = await Article.find({relative:item._id})
            const num1 = await parseInt(value1.length)
            articlecharts.push({
                value:num1,
                name:item.className
            })
            articlecategory.push(item.className)
        })
        
        setTimeout(()=>{
            res.send({usernum,productnum,articlenum,topicnum,buynum,productcharts,categorycharts,articlecategory,articlecharts})
        },200)
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
        if((count+numSize)<=(numSize*numPage)){
            const model = []
            res.send(model)
        } else {
            if(id){
                const model = await Product.find({pro_categories:id}).populate('seller').skip(skip).limit(Size)
                res.send(model)
            }else {
                const model = await Product.find().populate('seller').skip(skip).limit(Size)
                res.send(model)
            }
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

    //回显订单详情
    router.post('/orderDetail',solveMobileToken,async(req,res)=>{
        const {uid,gid} = req.body
        const user = await Account.findById(uid,'account nickname rece_info money')
        const good = await Product.findById(gid,'pro_price seller pro_imgs pro_description buyflag updatedAt buyer sendOrderList paybackflag').populate('seller')
        res.send({user,good})
    })

    //购买商品 买家扣钱
    router.post('/buyGood',solveMobileToken,async(req,res)=>{
        const {uid,gid,price,money,sid} = req.body
        let newmoney = parseFloat(money) - parseFloat(price)
        //商品记录
        await Product.findByIdAndUpdate(gid,{$set:{buyer:uid,buyflag:1}})
        //买家扣钱
        await Account.findByIdAndUpdate(uid,{$set:{money:newmoney}})
        //卖家增钱
        // const model = await Account.findById(sid,'money')
        // let sellermoney = parseFloat(model.money) + parseFloat(price)
        // await Account.findByIdAndUpdate(sid,{$set:{money:sellermoney}})
        res.send({message:'购买成功'})
    })

    //确认收货 卖家收钱
    router.post('/sureReceive',solveMobileToken,async(req,res)=>{
        const {gid,sid,price} = req.body
        //商品记录
        await Product.findByIdAndUpdate(gid,{$set:{buyflag:2}})
        //卖家增钱
        const model = await Account.findById(sid,'money')
        let sellermoney = parseFloat(model.money) + parseFloat(price)
        await Account.findByIdAndUpdate(sid,{$set:{money:sellermoney}})
        res.send({message:'收货成功'})
    })

    //商品退款申请
    router.post('/paybackApply',solveMobileToken,async(req,res)=>{
        const {gid,paybackflag} = req.body
        await Product.findByIdAndUpdate(gid,{$set:{paybackflag}})
        res.send({message:'发起退款申请中'})
    })

    //商品退款
    router.post('/payBack',solveMobileToken,async(req,res)=>{
        const {uid,gid,price,money,sid} = req.body
        let newmoney = parseFloat(money) + parseFloat(price)
        await Product.findByIdAndUpdate(gid,{$set:{buyflag:0,buyer:null,paybackflag:0,sendOrderList:null}})
        // await Product.findByIdAndRemove(gid,{buyer})
        await Account.findByIdAndUpdate(uid,{$set:{money:newmoney}})

        const model = await Account.findById(sid,'money')
        let sellermoney = parseFloat(model.money) - parseFloat(price)
        await Account.findByIdAndUpdate(sid,{$set:{money:sellermoney}})
        res.send({message:'退款成功'})
    })

    //回显我购买的商品
    router.post('/showMyBuy',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Product.find({buyer:id}).populate('seller')
        res.send(model)
    })

    //搜索商家、商品名
    router.post('/searchProduct',solveMobileToken,async(req,res)=>{
        const {key} = req.body
        const reg = new RegExp(key, 'i')
        const model = await Product.find({
            $or : [ //多条件，数组
                {pro_description : {$regex : reg}},
                {'seller.nickname' : {$regex : reg}}
            ]
        }).populate('seller')
        res.send(model)
    })

    //admin回显退款的个数通知
    router.post('/notifyPayback',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Product.find({seller:id})
        var i = 0;
        model.map((item)=>{
            if(item.paybackflag===1){
                i++
            }
        })
        // const paybacknum = model.length
        res.send({paybacknum:i})
    })

    //admin 回显商家首页信息
    router.post('/showSellerInfo',solveMobileToken,async(req,res)=>{
        const { id } = req.body
        //返回个人信息
        const user = await Account.findById(id,'+money')
        //返回商品信息、出售商品的总数量、总价值、已卖出数量、总盈利
        const product = await Product.find({seller:id})
        const productnum = product.length
        let productallprice = 0
        let soldnum = 0
        let salary = 0
        product.forEach(item=>{
            productallprice = productallprice + item.pro_price
            if(item.buyflag===1 || item.buyflag===2){
                soldnum = soldnum + 1
                salary = salary + item.pro_price
            }
        })
        setTimeout(()=>{
            res.send({user,productnum,productallprice,soldnum,salary})
        },200)
    })

    const Ad = require('../../models/Ad')
    const AdPrice = require('../../models/AdPrice')
    //admin 商家申请广告位
    router.post('/applyAd',solveMobileToken,async(req,res)=>{
        await Ad.create(req.body)
        res.send({message:'广告位申请成功'})
    })

    //admin 商家修改广告位
    router.post('/editAd',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Ad.findByIdAndUpdate(id,req.body)
        res.send({message:'修改成功'})
    })

    //admin 商家删除广告位
    router.post('/delAd',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        await Ad.findByIdAndDelete(id)
        res.send({message:'删除成功'})
    })

    //admin 判断是否已申请了广告位
    router.post('/ifApplyAd',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await find({relative:id})
        if(model){
            res.send({ifAdflag:true})
        } else {
            res.send({ifAdflag:false})
        }
    })

    //admin 回显申请的广告位
    router.post('/showAppliedAd',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Ad.findById(id)
        res.send(model)
    })

    //admin 回显申请的广告位列表
    router.post('/showAppliedAdList',solveMobileToken,async(req,res)=>{
        const {id,numPage,numSize} = req.body
        const count = await Ad.countDocuments({relative:id})
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
        const items = await Ad.find({relative:id}).populate('relative').skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })

    //admin 商家便捷显示隐藏广告
    router.post('/ifshowAd',solveMobileToken,async(req,res)=>{
        const {id,ad_showflag} = req.body
        await Ad.findByIdAndUpdate(id,{$set:{ad_showflag}})
        res.send({message:'修改状态成功'})
    })

    //admin 商家回显广告价格
    router.post('/showAdPrice',solveMobileToken,async(req,res)=>{
        const model = await AdPrice.find()
        res.send(model)
    })

    //admin 商家回显广告位总开销
    router.post('/showAdAllPay',solveMobileToken,async(req,res)=>{
        const {id} = req.body
        const model = await Ad.find({relative:id,ad_flag:3})
        let totalprice = 0
        model.forEach(item=>{
            totalprice = totalprice + item.ad_price
        })
        setTimeout(()=>{
            res.send({totalprice})
        },200)
    })

    //admin 商家支付广告费用
    router.post('/payAd',solveMobileToken,async(req,res)=>{
        const {adid,id} = req.body
        const user = await Account.findById(id,'+money')
        const ad = await Ad.findById(adid)
        //判断钱够不够  
        if(user.money<ad.ad_price){
            res.send({message:'账户余额不足，支付失败，请充值！'})
            return
        } else {
            let newmoney = parseFloat(user.money) - parseFloat(ad.ad_price)
            let newtime = Date.now() + ad.ad_timelong*1000
            await Account.findByIdAndUpdate(id,{$set:{money:newmoney}})
            await Ad.findByIdAndUpdate(adid,{$set:{ad_timestart:Date.now(),ad_timeline:newtime,ad_flag:3}})
            res.send({message:'支付成功,广告位生效'})
        }
    })

    //移动端 显示广告
    router.post('/showpayad',solveMobileToken,async(req,res)=>{
        const model = await Ad.find({ad_flag:3})
        let swiper = []
        //把已过期的挑选出来
        model.forEach(item=>{
            if(Date.now()<new Date(Date.parse(item.ad_timeline)).getTime()){
                swiper.push(item)
            }
        })
        res.send(swiper)
    })

    //admin 管理端 回显所有广告申请
    app.post('/admin/api/showAllAd',solveAdminToken,async(req,res)=>{
        const count = await Ad.countDocuments()
        //前端传入页数
        let Page = Number(req.body.numPage) || 1;
        //前端传入每页条数
        let Size = Number(req.body.numSize)|| 1;
        //计算总页数
        let allPages = Math.ceil(count/Size);
        //当前页不能大于总页数
        Page = Math.min(Page,allPages)
        //当前页不能小于1
        Page = Math.max(Page,1)
        //忽略数
        let skip = (Page-1)*Size;
        const items = await Ad.find().populate('relative').skip(skip).limit(Size)
        BeanPage = {
            count,
            Page,
            Size,
            allPages
        }
        res.send({items,BeanPage})
    })

    //admin管理端 同意商家广告
    app.post('/admin/api/manageAdApply',solveAdminToken,async(req,res)=>{
        const {id,flag} = req.body
        await Ad.findByIdAndUpdate(id,{$set:{ad_flag:flag}})
        res.send({message:'操作成功'})
    })

    //admin 管理端 备注信息
    app.post('/admin/api/adRemarks',solveAdminToken,async(req,res)=>{
        const {id,ad_remarks} = req.body
        await Ad.findByIdAndUpdate(id,{$set:{ad_remarks}})
        res.send({message:'备注成功'})
    })

    //admin管理端 管理员设置广告价格与时长 和删除
    app.post('/admin/api/setAd',solveAdminToken,async(req,res)=>{
        await AdPrice.create(req.body)
        res.send({message:'设置成功'})
    })
    app.post('/admin/api/delAd',solveAdminToken,async(req,res)=>{
        const {id} = req.body
        await AdPrice.findByIdAndDelete(id)
        res.send({message:'删除成功'})
    })
    app.post('/admin/api/showAd',solveAdminToken,async(req,res)=>{
        const model = await AdPrice.find()
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