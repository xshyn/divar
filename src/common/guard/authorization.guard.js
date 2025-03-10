const createHttpError = require("http-errors")
const { userModel } = require("../../modules/user/user.model")
const AuthorizationMessage = require("../messages/authorization.message")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Authorization = async (req , res , next) => {
    try {
        const token = req?.cookies?.access_token
        
        if(!token) throw createHttpError.Unauthorized(AuthorizationMessage.login);
        
        const data = jwt.verify(token , process.env.JWT_SECRET_KEY)
        if (typeof data === "object" && "id" in data){
            const user = await userModel.findById(data.id , { __v: 0 ,accessToken: 0 , otp: 0, updatedAt:0, verifidMobile:0, }).lean()

            if(!user) throw createHttpError.Unauthorized(AuthorizationMessage.notFoundUser)

            req.user = user
            return next()
        }
        throw createHttpError.Unauthorized(AuthorizationMessage.invalidToken)
    } catch (error) {
        next(error)
    }
}
module.exports = Authorization