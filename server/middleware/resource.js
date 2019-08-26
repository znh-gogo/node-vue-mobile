module.exports = resOptions => {
    return async (req,res,next)=>{
        // const ModelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../models/${req.params.resource}`)
        await next()
    } 
}