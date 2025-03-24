import mongoose from "mongoose"

//1.schema
const BlogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{ timestamps: true})

//2.model
const Blog = mongoose.model("Blog",BlogSchema);

//3.export
export default Blog