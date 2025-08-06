import JWTService from "../services/JWTService.js";

// this middle ware will check user is authencicated or not to process the request..
const auth = async (req, res, next) =>{
    // 1. refresh , access token validation
    const {refreshToken, accessToken} = req.cookies;

    if(!refreshToken || accessToken){
        const error = {
            status : 401, 
            message : 'Unauthorized'
        }
        return next(error);
    }
 
    let _id;
    try{
        _id = JWTService.verifyAccessToken(accessToken)._id;
    }
    catch(error){
        return next(error);
    }

    let user;
    try{
        user = await User.findOne({_id : _id});
    }
    catch(error){
        return next(error);
    }
    req.user = user; //since we are calling it before logout so user field will be available to logout  
    next(); 
}

export {auth};