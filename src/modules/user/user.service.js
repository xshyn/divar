const autoBind = require("auto-bind")
const {userModel} = require("./user.model");


class UserService {
    #model;
    constructor(){
        this.#model = userModel
        autoBind(this)
    }
}

module.exports = new UserService()