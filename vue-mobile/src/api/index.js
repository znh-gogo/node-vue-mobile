import request from './fetch.js'

const api = {
// 例子
  login (data) {
    return request('http://localhost:3000/mobile/api/login', data, 'post')
  },
  register(data) {
    return request('http://localhost:3000/mobile/api/register', data, 'post')
  },
  showAccount(id,data) {
    return request('http://localhost:3000/mobile/api/showAccount/'+id,data, 'post')
  },
  changeNickname(data) {
    return request('http://localhost:3000/mobile/api/updateNickname', data, 'post')
  },
  changeDescription(data) {
    return request('http://localhost:3000/mobile/api/updateDescription', data, 'post')
  },
  changeEmail(data) {
    return request('http://localhost:3000/mobile/api/updateEmail', data, 'post')
  },
  changeTelephone(data) {
    return request('http://localhost:3000/mobile/api/updateTelephone', data, 'post')
  },
  changePassword(data) {
    return request('http://localhost:3000/mobile/api/updatePassword', data, 'post')
  },
  changeHeadimg(data) {
    return request('http://localhost:3000/mobile/api/updateHeadimg', data, 'post')
  },
  uploadImg(data) {
    return request('http://localhost:3000/mobile/api/upload', data, 'post')
  },
  changeAddress(data) {
    return request('http://localhost:3000/mobile/api/updateAddress', data, 'post')
  },
  Feedback(data) {
    return request('http://localhost:3000/mobile/api/feedback', data, 'post')
  },
  showMyFeedback(data) {
    return request('http://localhost:3000/mobile/api/showMyFeedback', data, 'post')
  },
  showMyFeedbackDetail(data) {
    return request('http://localhost:3000/mobile/api/showMyFeedbackDetail', data, 'post')
  },
  delMyfeedback(data) {
    return request('http://localhost:3000/mobile/api/delMyfeedback', data, 'post')
  },
  showMyMoney(data) {
    return request('http://localhost:3000/mobile/api/showMyMoney', data, 'post')
  },
  recharge(data) {
    return request('http://localhost:3000/mobile/api/recharge', data, 'post')
  },
  
  

  //主题区
  sendTopic(data) {
    return request('http://localhost:3000/mobile/api/sendtopic', data, 'post')
  },
  showTopicList(data) {
    return request('http://localhost:3000/mobile/api/topiclist', data, 'post')
  },
  topicComment(data) {
    return request('http://localhost:3000/mobile/api/comment', data, 'post')
  },
  delComment(data) {
    return request('http://localhost:3000/mobile/api/delcomment', data, 'post')
  },
  delTopic(data) {
    return request('http://localhost:3000/mobile/api/deltopic', data, 'post')
  },
  thinkGood(data) {
    return request('http://localhost:3000/mobile/api/thinkgood', data, 'post')
  },

  //私信区
  showPrivateLetter(data) {
    return request('http://localhost:3000/mobile/api/showprivateletter', data, 'post')
  },
  sendPrivateLetter(data) {
    return request('http://localhost:3000/mobile/api/sendprivateletter', data, 'post')
  },
  showConversation(data) {
    return request('http://localhost:3000/mobile/api/showConversation', data, 'post')
  },
  delConversation(data) {
    return request('http://localhost:3000/mobile/api/delConversation', data, 'post')
  },
  searchConversation(data) {
    return request('http://localhost:3000/mobile/api/searchConversation', data, 'post')
  },


  //资讯区
  getArticleclass(data) {
    return request('http://localhost:3000/mobile/api/getArticleclass', data, 'post')
  },
  getArticle(data) {
    return request('http://localhost:3000/mobile/api/getArticle', data, 'post')
  },
  newsInfo(data) {
    return request('http://localhost:3000/mobile/api/newsInfo', data, 'post')
  },
  getAllNews(data) {
    return request('http://localhost:3000/mobile/api/getAllNews', data, 'post')
  },

  //商品区
  MobileProduct(data) {
    return request('http://localhost:3000/mobile/api/MobileProduct', data, 'post')
  },
  proCategory(data) {
    return request('http://localhost:3000/mobile/api/proCategory', data, 'post')
  },
  showMyProdetail(data) {
    return request('http://localhost:3000/mobile/api/showMyProdetail', data, 'post')
  },
  saveProduct(data) {
    return request('http://localhost:3000/mobile/api/saveProduct', data, 'post')
  },
  ProLeaving(data) {
    return request('http://localhost:3000/mobile/api/ProLeaving', data, 'post')
  },
  delLeaving(data) {
    return request('http://localhost:3000/mobile/api/delLeaving', data, 'post')
  },
  
  
}

export default api
