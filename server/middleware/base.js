const captcha = require('trek-captcha');

const Imgverify = (req,res) =>{
     return captcha().then((info)=>{
        req.session.Imgverifys = info.token
        // console.log(req.session.Imgverifys)
        return info.buffer
    }).catch(()=>{
        return false;
    })
}

module.exports = {
    Imgverify
}