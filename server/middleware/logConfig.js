module.exports = function logConfig(req,desc){
    var logs = {
        log_name:req.user.adminName,
        log_agent:req.headers['user-agent'],
        log_url:req.originalUrl,
        log_method:req.method,
        log_ip:req.headers.origin,
        log_status:req.statusCode,
        log_desc:desc
    }
    return logs
}