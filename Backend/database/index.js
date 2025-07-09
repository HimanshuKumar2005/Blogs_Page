import mongoose from "mongoose"
import { MONGODB_CONNECTION_STRING } from "../config/index.js";

const connectionString = MONGODB_CONNECTION_STRING

//function to connect
const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(connectionString);
        console.log(`Database connected to host : ${connect.connection.host}`);
    }
    catch(e){
        console.log(`Error in DB connection : ${e}`);
    }
}

//exporting the function
export default dbConnect;