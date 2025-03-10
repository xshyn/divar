const autoBind = require("auto-bind");
const optionService = require("./option.service");
const { optionMessages } = require("./option.messages");
const httpCodes = require("http-codes")

class OptionController {
    #service;
    constructor(){
        autoBind(this)
        this.#service = optionService
    }
    async create(req ,res , next){
        try {
            const {title, key, type, enum: list, guide, category, required} = req.body
            await this.#service.create({title, key, type, list, guide, category, required})
            return res.status(httpCodes.CREATED).json({
                message: optionMessages.created
            })
            
        } catch (error) {
            next(error)
            
        }
    }
    async update(req ,res , next){
        try {
            const {title, key, type, enum: list, guide, category, required} = req.body
            const { id } = req.params
            console.log(id);
            await this.#service.update(id , {title, key, type, list, guide, category, required})
            return res.json({
                message: optionMessages.updated
            })
            
        } catch (error) {
            next(error)
            
        }
    }
    async findByCategoryId(req ,res , next){
        try {
            const { categoryId } = req.params
            const options = await this.#service.findByCategory(categoryId)
            return res.json(options)
            
        } catch (error) {
            next(error)
            
        }
    }
    async findByCategorySlug(req ,res , next){
        try {
            const { slug } = req.params
            const options = await this.#service.findByCategorySlug(slug)
            return res.json(options)
            
        } catch (error) {
            next(error)
            
        }
    }
    async findById(req ,res , next){
        try {
            const {id} = req.params
            const option = await this.#service.findById(id)
            return res.json(option)
            
        } catch (error) {
            next(error)
            
        }
    }
    async deleteById(req ,res , next){
        try {
            const {id} = req.params
            await this.#service.deleteById(id)
            return res.json({
                message: optionMessages.deleted
            })
            
        } catch (error) {
            next(error)
            
        }
    }
    async find(req ,res , next){
        try {
            const options = await this.#service.find()
            return res.json(options)
        } catch (error) {
            next(error)
            
        }
    }
}

module.exports = new OptionController()