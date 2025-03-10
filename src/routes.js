const { Router } = require("express");
const { authRouter } = require("./modules/auth/auth.routes");
const {userRouter} = require("./modules/user/user.routes");
const { categoryRouter } = require("./modules/category/category.routes");
const { optionRouter } = require("./modules/option/option.routes");
const { postRouter } = require("./modules/post/post.routes");
const postController = require("./modules/post/post.controller");

const router = Router()

router.use("/auth", authRouter)
router.use("/user", userRouter)
router.use("/category", categoryRouter)
router.use("/option", optionRouter)
router.use("/post" , postRouter)
router.get("/" , postController.postList)
router.get("/panel" , (req, res) => {
    res.render("./pages/panel/dashboard")
})
router.get("/auth" , (req, res) => {
    res.locals.layout = "./layouts/auth/main"
    res.render("./pages/auth/login")
})

module.exports = {
    allRoutes: router
}