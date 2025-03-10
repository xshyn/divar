const { Router } = require("express");
const AuthController = require("./auth.controller")
const Authorization = require("../../common/guard/authorization.guard");
const router = Router()

router.post("/send-otp" , AuthController.sendOTP)
router.post("/check-otp" , AuthController.checkOTP)
router.get("/logout" , Authorization , AuthController.logOut)

module.exports = {
    authRouter: router
}