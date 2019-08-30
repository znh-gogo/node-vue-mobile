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
  
  
}

export default api
