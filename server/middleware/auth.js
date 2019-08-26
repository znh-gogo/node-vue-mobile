module.exports= authOptions =>{
    // const express = require("express")
    const jwt = require('jsonwebtoken')
    // const AdminUser1 = require('../models/AdminUser')
    const assert = require('http-assert')
    return async (req,res,next)=>{
        const token = await String(req.headers.authorization || '').split(' ').pop()
        assert(token,401,'请先登录') 
        const {id} = await jwt.verify(token,req.app.get('secret'))
        assert(id,401,'请先登录')         
        req.user = await AdminUser1.findById(id)
        assert(req.user,401,'请先登录') 
        await next()
    }
}