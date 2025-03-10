const { Router } = require("express");
const UserController = require("./user.controller");
const Authorization = require("../../common/guard/authorization.guard");
const userController = require("./user.controller");
const router = Router()

router.get("/whoami" , Authorization , userController.whoami)

module.exports = {
    userRouter: router
}