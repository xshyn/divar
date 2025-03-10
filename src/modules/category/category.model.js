const { Schema, Types, model } = require("mongoose");

const categorySchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    icon: {type: String, required: true, indexL: true},
    parent: {type: Types.ObjectId, ref:"Category" , required: false},
    parents: {type: [Types.ObjectId], ref:"Category" , required: false, default: []},
} , {toJSON: {virtuals:true} , versionKey:false, id:false})

categorySchema.virtual("children" , {
    ref: "Category",
    localField: "_id",
    foreignField: "parent"
})

function autoPopulate(next){
    this.populate("children")
    next()
}

categorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate)

const categoryModel = model("Category" , categorySchema)
module.exports = {
    categoryModel
}