import mongoose from "mongoose";

//1.Defining the schema
const UserSchema = new mongoose.Schema({
   name : {
    type:String,
    required:true,
    trim : true
   },
   username :{
    type : String,
    required : true,
    trim : true
   },
   email : {
    type : String,
    required : true
   },
   password : {
    type : String,
    required : true
   }
},{timestamps : true})

//2.creating the model
const User = mongoose.model("User",UserSchema);

//3.export the model
export default User