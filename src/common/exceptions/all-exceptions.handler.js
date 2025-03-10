function allExceptionHandler(err , req , res){
    let status = err?.status ?? err?.statusCode ?? err?.code
    if(!status || isNaN(+status) || status > 511 || status < 200) status = 500
    res.status(status).json({
        message: err?.message ?? err.stack ?? "InternalServerError"
    })
}
module.exports = {
    allExceptionHandler
}