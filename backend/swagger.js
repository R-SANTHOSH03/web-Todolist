// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger config options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Todo webapp API",
      version: "1.0.0",
      description: "API documentation for  Todo app (login, signup, etc.)",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerSpec);
