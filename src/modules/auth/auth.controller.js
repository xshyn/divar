const autoBind = require("auto-bind");
const authService = require("./auth.service");
const { authMessages } = require("./auth.messages");
const NodeEnv = require("../../common/constant/env.enum");
const CookieNames = require("../../common/constant/cookie.enum");

class AuthController {
    #service;
    constructor(){
        this.#service = authService
        autoBind(this)
    }
    // Sending OTP to the Mobile in the Body of the Req
    async sendOTP(req, res , next) {
        try {
            const {mobile} = req.body
            await this.#service.sendOTP(mobile)
            return res.json({
                message: authMessages.sendOTPSuccessfuly
            })
        } catch (error) {
            next(error)
        }
    }
    async checkOTP(req, res , next) {
        try {
            const { mobile , code } = req.body
            const token = await this.#service.checkOTP(mobile, code)
            return res.cookie("access_token" , token , {
                httpOnly: true,
                secure: process.env.NODE_ENV === NodeEnv.Production
            }).status(200).json({
                message: authMessages.loginSuccessfully
            })
            
        } catch (error) {
            next(error)
        }
    }
    async logOut(req , res , next){
        try {
            return res.clearCookie(CookieNames.AccessToken).status(200).json({
                message: authMessages.logoutSuccessfully
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()