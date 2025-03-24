import mongoose from "mongoose"

const connectionString = "mongodb+srv://himanshukumar06764:password@cluster0.sgwrb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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