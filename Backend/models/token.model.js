import mongoose from "mongoose";

const refreshTokenSchema = mongoose.Schema({
    token : {type : String, required : true},
    userid : {type : mongoose.Schema.ObjectId, ref : 'users'}
}, {timestamps : true});

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema, 'tokens'); // in database a collection will be there named as token

export default RefreshToken