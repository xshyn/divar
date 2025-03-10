const autoBind = require("auto-bind");
const categoryService = require("./category.service");
const httpCodes = require("http-codes");
const { CategoryMessage } = require("./category.messages");

class CategoryController {
    #service;
    constructor() {
        autoBind(this)
        this.#service = categoryService
    }

    async create(req, res, next) {
        try {
            const {name , slug , icon , parent} = req.body
            await this.#service.create({name , slug , icon , parent})
            return res.status(httpCodes.CREATED).json({
                message: CategoryMessage.created
            })
        } catch (error) {
            next(error)
            
        }

    }
    async find(req, res, next) {
        try {
            const categories = await this.#service.find()
            return res.json(categories)
        } catch (error) {
            next(error)
            
        }

    }
    async delete(req, res, next) {
        try {
            const { id } = req.params
            await this.#service.delete(id)
            return res.json({
                message: CategoryMessage.deleted
            })
        } catch (error) {
            next(error)
            
        }

    }
}

module.exports = new CategoryController()