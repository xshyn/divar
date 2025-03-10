const autoBind = require("auto-bind");
const { optionModel } = require("./option.model");
const { categoryModel } = require("../category/category.model");
const createHttpError = require("http-errors");
const { optionMessages } = require("./option.messages");
const { default: slugify } = require("slugify");
const { isTrue, isFalse } = require("../../common/utils/functions");
const { isValidObjectId } = require("mongoose");
const categoryService = require("../category/category.service")

class OptionService {
    #model;
    #categoryService;
    constructor(){
        autoBind(this)
        this.#model = optionModel
        this.#categoryService = categoryService
    }
    async create(optionDto){
        const category = await this.#categoryService.checkExistById(optionDto.category)
        optionDto.category = category._id
        optionDto.key = slugify(optionDto.key , {trim: true, replacement:"_", lower: true})
        await this.alreadyExistByCategoryAndKey(category._id, optionDto.key)
        if(optionDto?.list && typeof optionDto.list === "string"){
            optionDto.list = optionDto.list.split(",")
        }else if (!Array.isArray(optionDto.list)) optionDto.list = []
        if(isTrue(optionDto?.required)) optionDto.required = true
        if(isFalse(optionDto?.required)) optionDto.required = false
        const option = await this.#model.create({enum: optionDto.list , ... optionDto})
        return option

    }
    async update(id, optionDto){
        const existOption = await this.checkOptionExistById(id)
        if(optionDto?.category && isValidObjectId(optionDto.category)){
            const category = await this.#categoryService.checkExistById(optionDto.category)
            optionDto.category = category._id
        } else {
            delete optionDto.category
        }

        if(optionDto?.key){
            optionDto.key = slugify(optionDto.key , {trim: true, replacement: "_", lower: true})
            let categoryId = existOption.category
            if(optionDto?.category) categoryId = optionDto.category
            await this.alreadyExistByCategoryAndKey(categoryId, optionDto.key)
        } else {
            delete optionDto.key
        }

        if(optionDto?.list && typeof optionDto.list === "string"){
            optionDto.list = optionDto.list.split(",")
        }else if (!Array.isArray(optionDto.list)) delete optionDto.list

        if(isTrue(optionDto?.required)) optionDto.required = true
        else if(isFalse(optionDto?.required)) optionDto.required = false
        else delete optionDto.required

        return await this.#model.updateOne({_id: id} , {$set: {enum: optionDto.list, ... optionDto}})

    }
    async find(){
        const options = await this.#model.find({} , {__v: 0} , {sort: {_id: -1}}).populate({path: "category", select: {name: 1, slug: 1}})
        return options
    }
    async findById(id){
        const option = await this.#model.findOne({_id: id} , {__v: 0}).populate({path: "category", select: {name: 1, slug: 1}})
        return option
    }
    async deleteById(id){
        await this.checkOptionExistById(id)
        await this.#model.deleteOne({_id: id})
    }
    async findByCategory(id){
        const options = await this.#model.find({category: id} , {__v: 0}).populate({path: "category", select: {name: 1, slug: 1}})
        return options
    }
    async findByCategorySlug(slug){
        const options = await this.#model.aggregate([
            {
                $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $addFields: {
                    categoryName: "$category.name",
                    categorySlug: "$category.slug",
                    categoryIcon: "$category.icon"
                }
            },
            {
                $project: {
                    category: 0,
                    __v: 0
                }
            },
            {
                $match: {
                    categorySlug: slug
                }
            }
        ])
        return options
    }
    async checkOptionExistById(id){
        const option = await this.#model.findById(id)
        if(!option) throw new createHttpError.NotFound(optionMessages.notFound)
        return option
    }
    async alreadyExistByCategoryAndKey(category,key){
        const isExist = await this.#model.findOne({category, key})
        if(isExist) throw new createHttpError.Conflict(optionMessages.notFound)
        return null
    }
}

module.exports = new OptionService()