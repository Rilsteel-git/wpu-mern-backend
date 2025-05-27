import swaggerAutogen from "swagger-autogen";

const doc = {
    servers: [
        {
            url: "https://wpu-mern-backend.vercel.app/api",
            description: "Deployed server"
        },
        {
            url: "http://localhost:3000/api",
            description: "Local server"
        }
    ],
    components:{
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "syahrillramadhan",
                password: "password123" 
            }
        }
    }
}


const OutputFileType = "./src/docs/swagger-output.json";
const endpointFiles = ["./src/routes/api.ts"];


swaggerAutogen({ openapi: "3.0.0" })(OutputFileType, endpointFiles, doc)