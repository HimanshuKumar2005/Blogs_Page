import express from "express";
import dbconnect from "./database/index.js"

const app = express()
const PORT = 3000

//data base connection call
dbconnect();

//middle wares
app.use(express.json())

//defining the routes
app.get("/",(req,res)=>{
    res.send("Hello, express...adding nodemon to restart the server when any change detect this would be only for dev dependency...")
})

//starting the server
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})