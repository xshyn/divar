const multer = require("multer");
const fs = require("fs")
const path = require("path");
const createHttpError = require("http-errors");

const storage = multer.diskStorage({
    destination: function (req , file , cb){
        fs.mkdirSync(path.join(process.cwd() , "src", "public" , "upload") , {recursive: true})

        cb(null , "src/public/upload")
    },
    filename: function (req , file , cb){
        const mimetypes = ["image/jpg","image/jpeg","image/webp","image/png",]

        if(mimetypes.includes(file.mimetype)){
            const format = path.extname(file.originalname)
            const filename = new Date().getTime().toString() + format
            cb(null , filename)
        }else{
            cb(new createHttpError.BadRequest("invalid format type"))
        }
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 3 * 1000 * 1000
    }
})

module.exports = {
    upload
}