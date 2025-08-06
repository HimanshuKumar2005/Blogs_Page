import express from "express";
import dbconnect from "./database/index.js"
import { PORT } from "./config/index.js";
import router from "./router/index.js"
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
const app = express()


//middle wares
app.use(cookieParser());
app.use(express.json()) // this will enable the server to send and receive the data in json..
app.use(router)

//data base connection call
dbconnect();

app.use(errorHandler);

//defining the routes
/*app.get("/",(req,res)=>{
    res.send("Hello, express...adding nodemon to restart the server when any change detect this would be only for dev dependency...")
}) */

//starting the server
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})