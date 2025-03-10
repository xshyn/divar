const { Schema, Types, model } = require("mongoose");

const postSchema = new Schema({
    title: {type: String , required: true},
    userId: {type: Types.ObjectId, ref:"user" , required: true},
    content: {type: String , required: true},
    amount: {type: Number , required: true, default: 0},
    category: {type: Types.ObjectId, ref: "Category" , required: true},
    province: {type: String, required: false},
    city: {type: String, required: false},
    district: {type: String, required: false},
    address: {type: String, required: false},
    cordinate: {type: [Number], required: true},
    images: {type: [String] , required: false, default: []},
    options: {type: Object, default: {}}
}, {
    timestamps: true
})

const postModel = model("Post" , postSchema)
module.exports = {
    postModel
}