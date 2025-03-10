const autoBind = require("auto-bind");
const { categoryModel } = require("./category.model");
const { optionModel } = require("../option/option.model")
const { CategoryMessage } = require("./category.messages");
const createHttpError = require("http-errors");
const { isValidObjectId, Types } = require("mongoose");
const { default: slugify } = require("slugify");

class CategoryService {
    #model;
    #optionModel;
    constructor() {
        autoBind(this)
        this.#model = categoryModel
        this.#optionModel = optionModel
    }   
    async create(categoryDto){
        if(categoryDto?.parent || isValidObjectId(categoryDto.parent)){
            const existCategory = await this.checkExistById(categoryDto.parent)
            categoryDto.parent = existCategory._id
            categoryDto.parents =  [
                ... new Set(
                ([existCategory._id.toString()].concat(
                    existCategory.parents.map(id => id.toString())
                )).map(id => new Types.ObjectId(id))
                )
            ]
        }
        if(categoryDto?.slug){
            categoryDto.slug = slugify(categoryDto.slug)
            await this.alreadyExistBySlug(categoryDto.slug)
        }
        else categoryDto.slug = slugify(categoryDto.name)
        const category = await this.#model.create(categoryDto)
        return category
        
    }
    async find(){
        const categories = await this.#model.find({parent: {$exists: false}})
        return categories
    }
    async delete(id){
        await this.#optionModel.deleteMany({category: id}).then(async () => {
            await this.#model.deleteOne({_id: id})
        })
    }
    async checkExistById(id){
        const category = await this.#model.findById(id)
        if(!category) throw new createHttpError.NotFound(CategoryMessage.notFound)
        return category;
    }
    async checkExistBySlug(slug){
        const category = await this.#model.findOne({slug})
        if(!category) throw new createHttpError.NotFound(CategoryMessage.notFound)
    }
    async alreadyExistBySlug(slug){
        const category = await this.#model.findOne({slug})
        if(category) throw new createHttpError.Conflict(CategoryMessage.alreadyExist)
        return null
    }
}

module.exports = new CategoryService()