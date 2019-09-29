import axios from 'axios'
import Vue from 'vue'
import router from '../router'
const http = axios.create({
    baseURL:""
})

http.interceptors.request.use(config  =>{
    if (sessionStorage.token){
        config.headers.Authorization= 'Bearer '+ (sessionStorage.token||'')
    }
    return config
},err =>{
    return Promise.reject(err)
})

http.interceptors.response.use(res =>{
    return res
},err=>{
    if(err.response.data.message){
        Vue.prototype.$message.error(err.response.data.message)
    }
    
    if (err.response.status===401){
        router.push('/login')
    }
    return Promise.reject(err) 
})

export default http