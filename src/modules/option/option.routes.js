const { Router } = require("express");
const optionController = require("./option.controller");

const router = Router()

router.post('/' , optionController.create)
router.get('/by-category/:categoryId' , optionController.findByCategoryId)
router.get('/by-category-slug/:slug' , optionController.findByCategorySlug)
router.get('/:id' , optionController.findById)
router.delete('/:id' , optionController.deleteById)
router.put('/:id' , optionController.update)
router.get('/' , optionController.find)

module.exports = {
    optionRouter: router
}