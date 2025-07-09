import Joi from "joi"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
const authController = {  // this is an object that contains all the methods

    async register(req, res, next){
        //1.validate user input using joi 
        const userRegistrationSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),     
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref("password")
        });

        const {error} = userRegistrationSchema.validate(req.body)

        //2.if error in validation -> return error via middleware
        if(error) {
            return next(error)
        }
        //3.if email or username is already registered -> return an error
        //for this we have to search from the database
        const {username, name, email, password} = req.body
        try{ //since this can give an error as we are interacting with other continent
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username})

            if(emailInUse){
                const error = {
                    status:409,
                    message: "Email already registered, use another email !",
                };

                return next(error)
            }

            if(usernameInUse){
                const error = {
                    status:409,
                    message: "username already registered, use another email !",
                };

                return next(error)
            }
        }
        catch(e){
            return next(error);
        }
        //4.password hash
        const hashedPassword = await bcrypt.hash(password, 10);
        //5.store user data in db
        let accessToken;
        let refreshToken;

        let user;

        try{
            const userToRegister = new User({
                username,
                email,
                name,
                password: hashedPassword
            });

            user = await userToRegister.save();

            // token generation
        }
    }

}