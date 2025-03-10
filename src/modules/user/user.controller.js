const autoBind = require("auto-bind");
const userService = require("./user.service");

class UserController {
    #service;
    constructor(){
        this.#service = userService
        autoBind(this)
    }
    async whoami(req ,res , next){
        try {
            const user = req.user
            return res.json(user)
            
        } catch (error) {
            next(error)
        }

    }
}

module.exports = new UserController()