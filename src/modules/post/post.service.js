const autoBind = require("auto-bind");
const { postModel } = require("./post.model")
const { optionModel } = require("../option/option.model");
const { isValidObjectId, Types } = require("mongoose");
const createHttpError = require("http-errors");
const { PostMessage } = require("./post.messages");
const { categoryModel } = require("../category/category.model");

class PostService {
    #model;
    #optionModel
    #categoryModel
    constructor() {
        autoBind(this)
        this.#model = postModel
        this.#optionModel = optionModel
        this.#categoryModel = categoryModel
    }   
    async getCategoryOptions(categoryId) {
        const options = await this.#optionModel.find({category: categoryId})
        return options
    }
    async create(dto){
        const post = await this.#model.create(dto)
        return post
    }
    async find(userId){
        if(userId && isValidObjectId(userId)) return await this.#model.find({userId})
        throw new createHttpError.BadRequest(PostMessage.invalid)
    }
    async findAll(options){
        let {category, search} = options
        const query = {}
        if(category){
            const result = await this.#categoryModel.findOne({slug: category})
            const categories = await this.#categoryModel.find({parents: result._id} , {_id: 1})
            console.log(categories);
            if(result) {
                query["category"] = {
                    $in: [result._id , ... categories]
                }
            }else{
                return []
            }
        }
        if(search){
            search = new RegExp(search, "ig")
            query["$or"] = [
                {title: search},
                {content: search}
            ]
        }
        const posts = await this.#model.find(query , {} , {sort: {_id: -1}})
        return posts
    }
    async delete(id){
        const post = this.checkPostExist(id)
        await this.#model.deleteOne({_id: id})
    }
    async checkPostExist(id){
        if(!id && !isValidObjectId(id)) throw new createHttpError.BadRequest(PostMessage.invalid)
        const [post] = await this.#model.aggregate([
            {
                $match: {_id: new Types.ObjectId(id)}
            },
            {
                $lookup: {
                    from:"users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    userMobile: "$user.mobile"
                }
            },
            {
                $project: {
                    user: 0
                }
            }
        ])
        if(!post) throw new createHttpError.NotFound(PostMessage.notFound)
        return post
    }
}

module.exports = new PostService()