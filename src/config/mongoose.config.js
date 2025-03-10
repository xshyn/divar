const { default: mongoose } = require("mongoose");

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected To DB");
}).catch(err => {
    console.log(err?.message ?? "Failed DB Connection");
})