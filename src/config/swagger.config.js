const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express")

function swaggerConfig(app){
    const swaggerDoc = swaggerJSDoc({
        swaggerDefinition:{
            openapi:"3.0.1",
            info:{
                title: "divar",
                description: "divar backend API",
                version: "1.0.0"
            },
        },
        apis: [process.cwd() + "/src/modules/**/*.swagger.js"]
    })
    const swagger = swaggerUI.setup(swaggerDoc)
    app.use("/swagger" , swaggerUI.serve , swagger)
}

module.exports = swaggerConfig