import mongoose from "mongoose"

//1.Schema
const commentSchema = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    blog : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog"
    }
},{timestamps : true})


//2.Model
const Comment = mongoose.model("Comment",commentSchema)
//3.export
export default Comment