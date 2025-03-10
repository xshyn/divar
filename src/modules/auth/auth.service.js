const autoBind = require("auto-bind")
const jwt = require("jsonwebtoken")
const {userModel} = require("../user/user.model");
const createHttpError = require("http-errors");
const { authMessages } = require("./auth.messages");
const {randomInt} = require("crypto")

class AuthService {
    #model;
    constructor(){
        this.#model = userModel
        autoBind(this)
    }

    // Sending OTP Method for Controller
    async sendOTP(mobile) {

        // Find the user by Its Mobile
        const user = await this.#model.findOne({mobile})
        const now = new Date().getTime()

        // Generating 6-digits OTP number with 2 min expiration
        const otp = {
            code: randomInt(10000 , 99999),
            expiresIn: now + (2*60*1000)
        }
        // Check if user doesn't exist, make one, with Current Mobile Input
        if(!user){
            const newUser = await this.#model.create({mobile , otp})
        }
        // if exists and his/her OTP hasn't expired yet, throw a BAD REQUEST error
        // Benefit => avoid of requesting frequently for OTP
        if(user?.otp && user?.otp?.expiresIn > now){
            throw createHttpError.BadRequest(authMessages.otpIsNotExpired)
        }

        // otherwise, save the new OTP of user
        user.otp = otp
        await user.save()
        return user
    }
    async checkOTP(mobile , code) {
        const user = await this.checkExistByMobile(mobile)
        const now = new Date().getTime()

        if(user?.otp?.expiresIn < now) throw createHttpError.Unauthorized(authMessages.otpIsExpired)
        if(user?.otp?.code !== code) throw createHttpError.Unauthorized(authMessages.otpIsIncorrect)

        if(!user.varifiedMobile){
            user.varifiedMobile = true
        }
        const accessToken = await this.signToken({mobile , id: user._id})
        user.accessToken = accessToken
        await user.save()
        return accessToken

    }
    async signToken(payload){
        return jwt.sign(payload , process.env.JWT_SECRET_KEY , {
            expiresIn: "3d"
        })
    }
    async verifyToken(token){
        const { id } = jwt.verify(token , process.env.JWT_SECRET_KEY , (err) => {
            if(err) throw createHttpError.Unauthorized(authMessages.varifiedTokenUnsuccessfully)
        })
        const user = await this.#model.findById(id)
        return user

    }
    async checkExistByMobile(mobile){
        const user = await this.#model.findOne({mobile})
        if (!user) throw createHttpError.NotFound(authMessages.notFound)
        return user
    }
}

module.exports = new AuthService()