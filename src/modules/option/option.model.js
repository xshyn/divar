const { Schema, Types, model } = require("mongoose");

const optionSchema = new Schema({
    title: {type: String, required: true},
    key: {type: String, required: true},
    type: {type: String, enum: ["number", "array" , "string" , "boolean"], required: true},
    enum: {type: Array, default: []},
    guide: {type: String, required: false},
    required: {type: Boolean, required: true, default: false},
    category: {type: Types.ObjectId, ref: "Category" , required: true},
})

const optionModel = model("Option" , optionSchema)

module.exports = {
    optionModel
}