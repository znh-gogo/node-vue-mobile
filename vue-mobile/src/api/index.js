import request from './fetch.js'
const global = 'http://localhost:3000';

const api = {
// 登陆注册
  login (data) {
    return request(global+'/mobile/api/login', data, 'post')
  },
  register(data) {
    return request(global+'/mobile/api/register', data, 'post')
  },

  //个人中心
  showAccount(id,data) {
    return request(global+'/mobile/api/showAccount/'+id,data, 'post')
  },
  changeNickname(data) {
    return request(global+'/mobile/api/updateNickname', data, 'post')
  },
  changeDescription(data) {
    return request(global+'/mobile/api/updateDescription', data, 'post')
  },
  changeEmail(data) {
    return request(global+'/mobile/api/updateEmail', data, 'post')
  },
  changeTelephone(data) {
    return request(global+'/mobile/api/updateTelephone', data, 'post')
  },
  changePassword(data) {
    return request(global+'/mobile/api/updatePassword', data, 'post')
  },
  changeHeadimg(data) {
    return request(global+'/mobile/api/updateHeadimg', data, 'post')
  },
  uploadImg(data) {
    return request(global+'/mobile/api/upload', data, 'post')
  },
  changeAddress(data) {
    return request(global+'/mobile/api/updateAddress', data, 'post')
  },

  //反馈、收货地址、充值等功能
  Feedback(data) {
    return request(global+'/mobile/api/feedback', data, 'post')
  },
  showMyFeedback(data) {
    return request(global+'/mobile/api/showMyFeedback', data, 'post')
  },
  showMyFeedbackDetail(data) {
    return request(global+'/mobile/api/showMyFeedbackDetail', data, 'post')
  },
  delMyfeedback(data) {
    return request(global+'/mobile/api/delMyfeedback', data, 'post')
  },
  showMyMoney(data) {
    return request(global+'/mobile/api/showMyMoney', data, 'post')
  },
  recharge(data) {
    return request(global+'/mobile/api/recharge', data, 'post')
  },
  addReAddress(data) {
    return request(global+'/mobile/api/addReAddress', data, 'post')
  },
  showReAddress(data) {
    return request(global+'/mobile/api/showReAddress', data, 'post')
  },
  delReAddress(data) {
    return request(global+'/mobile/api/delReAddress', data, 'post')
  },
  defaultReAddress(data) {
    return request(global+'/mobile/api/defaultReAddress', data, 'post')
  },
  updateReAddress(data) {
    return request(global+'/mobile/api/updateReAddress', data, 'post')
  },
  
  

  //主题区
  sendTopic(data) {
    return request(global+'/mobile/api/sendtopic', data, 'post')
  },
  showTopicList(data) {
    return request(global+'/mobile/api/topiclist', data, 'post')
  },
  topicComment(data) {
    return request(global+'/mobile/api/comment', data, 'post')
  },
  delComment(data) {
    return request(global+'/mobile/api/delcomment', data, 'post')
  },
  delTopic(data) {
    return request(global+'/mobile/api/deltopic', data, 'post')
  },
  thinkGood(data) {
    return request(global+'/mobile/api/thinkgood', data, 'post')
  },

  //私信区
  showPrivateLetter(data) {
    return request(global+'/mobile/api/showprivateletter', data, 'post')
  },
  sendPrivateLetter(data) {
    return request(global+'/mobile/api/sendprivateletter', data, 'post')
  },
  showConversation(data) {
    return request(global+'/mobile/api/showConversation', data, 'post')
  },
  delConversation(data) {
    return request(global+'/mobile/api/delConversation', data, 'post')
  },
  searchConversation(data) {
    return request(global+'/mobile/api/searchConversation', data, 'post')
  },


  //资讯区
  getArticleclass(data) {
    return request(global+'/mobile/api/getArticleclass', data, 'post')
  },
  getArticle(data) {
    return request(global+'/mobile/api/getArticle', data, 'post')
  },
  newsInfo(data) {
    return request(global+'/mobile/api/newsInfo', data, 'post')
  },
  getAllNews(data) {
    return request(global+'/mobile/api/getAllNews', data, 'post')
  },
  saveNews(data) {
    return request(global+'/mobile/api/saveNews', data, 'post')
  },
  showmysaveNews(data) {
    return request(global+'/mobile/api/showmysaveNews', data, 'post')
  },
  


  //商品区
  MobileProduct(data) {
    return request(global+'/mobile/api/MobileProduct', data, 'post')
  },
  proCategory(data) {
    return request(global+'/mobile/api/proCategory', data, 'post')
  },
  showMyProdetail(data) {
    return request(global+'/mobile/api/showMyProdetail', data, 'post')
  },
  saveProduct(data) {
    return request(global+'/mobile/api/saveProduct', data, 'post')
  },
  ProLeaving(data) {
    return request(global+'/mobile/api/ProLeaving', data, 'post')
  },
  delLeaving(data) {
    return request(global+'/mobile/api/delLeaving', data, 'post')
  },
  mySavePro(data) {
    return request(global+'/mobile/api/mySavePro', data, 'post')
  },
  orderDetail(data) {
    return request(global+'/mobile/api/orderDetail', data, 'post')
  },
  buyGood(data) {
    return request(global+'/mobile/api/buyGood', data, 'post')
  },
  payBack(data) {
    return request(global+'/mobile/api/payBack', data, 'post')
  },
  showMyBuy(data) {
    return request(global+'/mobile/api/showMyBuy', data, 'post')
  },
  
  
}

export default api
