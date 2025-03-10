const { Router } = require("express");
const categoryController = require("./category.controller");

const router = new Router()

router.post("/" , categoryController.create)
router.get("/" , categoryController.find)
router.delete("/:id" , categoryController.delete)

module.exports = {
    categoryRouter: router
}