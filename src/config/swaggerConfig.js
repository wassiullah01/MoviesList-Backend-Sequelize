const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Movie List API",
            version: "1.0.0",
            description: "API documentation for Movie List application",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter the token with the `Bearer` prefix",
                },
            },
        },
        security: [{ BearerAuth: [] }], 
    },
    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // console.log("📄 Swagger UI available at: http://localhost:5000/swagger-ui");
};

module.exports = swaggerDocs;