const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
    code: {type: String , required: false, default: undefined},
    expiresIn: {type: Number , required: false, default:0}
})

const userSchema = new Schema({
    fullname: {type: String, required: false},
    mobile: {type: String, unique: true, required: true},
    otp: {type: otpSchema},
    verifidMobile: {type: Boolean, required: true, default: false},
    accessToken: {type: String}
}, {timestamps: true})

const userModel = model("user" , userSchema)

module.exports = {
    userModel
}