// here we will import the .env content and export it for further uses
import dotenv from "dotenv"

dotenv.config() 

const PORT = process.env.PORT
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING


export {
    PORT,
    MONGODB_CONNECTION_STRING
}