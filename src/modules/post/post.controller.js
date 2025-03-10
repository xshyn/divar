const autoBind = require("auto-bind");
const postService = require("./post.service");
const { categoryModel } = require("../category/category.model");
const { CategoryMessage } = require("../category/category.messages")
const createHttpError = require("http-errors");
const { Types } = require("mongoose");
const { PostMessage } = require("./post.messages");
const { default: axios } = require("axios");
const { removePropOfObject, getAddressDetail } = require("../../common/utils/functions");
const utf8 = require("utf8")

class PostController {
    #service;
    successMessage;
    failureMessage
    constructor() {
        autoBind(this)
        this.#service = postService
    }
    async createPostPage(req , res , next){
        try {
            let match = {parent: null}
            let { slug } = req.query
            let showBack = false
            let options , category;
            if(slug){
                slug = slug.trim()
                category = await categoryModel.findOne({slug})
                if(!category) throw new createHttpError.NotFound(CategoryMessage.notFound)
                options = await this.#service.getCategoryOptions(category._id)
                match = {parent: category._id}
                showBack = true
            }

            const categories = await categoryModel.aggregate([
                {
                    $match: match
                }
            ])
            res.render("./pages/panel/create-post" , {categories , showBack, options , category})
            
        } catch (err) {
            next(err)  
        }
    }
    async create(req, res, next){
        try {
            const images = req?.files?.map(image => (image?.destination + "/" +image?.filename)?.slice(11))

            const userId = req.user._id
            const posts = await this.#service.find(userId)
            const {lat , lng , title_post: title, content, category, amount} = req.body
            const { city , province , region , address } = await getAddressDetail(lat , lng)
            
            const options = removePropOfObject(req.body , ["amount","lat", "lng", "title_post", "content" , "category", "images"])
            
            for (let key in options) {
                const value = options[key]
                delete options[key]
                key = utf8.decode(key)
                options[key] = value
            }

            await this.#service.create({
                userId,
                amount,
                title,
                content,
                category: new Types.ObjectId(category),
                cordinate: [lat , lng],
                options,
                images,
                district: region,
                city,
                province,
                address
            })
            this.successMessage = PostMessage.created
            return res.redirect("/post/my")
        } catch (error) {
            next(error)  
        }
    }
    async findMyPosts(req , res , next){
        const userId = req.user._id
        const posts = await this.#service.find(userId)
        res.render("./pages/panel/posts", {
            posts,
            successMessage: this.successMessage,
            failureMessage: this.failureMessage
        })
        this.successMessage = null
    }
    async delete(req , res , next) {
        try {
            const {id} = req.params
            await this.#service.delete(id);
            this.successMessage = PostMessage.deleted
            return res.redirect("/post/my")
        } catch (error) {
            next(error)
            
        }
    }
    async showPost(req, res , next) {
        try {
            const {id} = req.params
            const post = await this.#service.checkPostExist(id)
            res.locals.layout = "./layouts/website/main"
            return res.render("./pages/home/post", {post})
            
        } catch (error) {
            next(error) 
        }
    }
    async postList(req, res , next) {
        try {
            const query = req.query
            const posts = await this.#service.findAll(query)
            res.locals.layout = "./layouts/website/main"
            return res.render("./pages/home/index", {posts})
            
        } catch (error) {
            next(error) 
        }
    }
}

module.exports = new PostController()