import Joi from "joi"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import JWTService from "../services/JWTService.js";
import RefreshToken from "../models/token.model.js";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authController = {  // this is an object that contains all the methods

    

    async register(req, res, next){
        console.log("we are in register phase.")
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
            accessToken = JWTService.signAccessToken({_id : user._id}, '30m');
            refreshToken = JWTService.signRefreshToken({_id : user._id}, '60m');

        }
        catch(error){
            return next(error);
        }

        // store the refresh token in db
        JWTService.storeRefreshToken(refreshToken, user._id);

        //send token in cookie
        res.cookie('accessToken', accessToken, {
            maxAge : 1000*60*60*24,  //cookie will expire in this , ms
            httpOnly : true  // just for security.. browser can't access this cookie, it reduces xss attack
        })
       
        res.cookie('refreshToken', refreshToken, {
            maxAge : 1000*60*60*24,
            httpOnly  :true
        })
        

        //6. send response to receive in postman\
        return res.status(201).json({user: user}); // here status code is 201 that basically shows that something is created.
        
    },
    async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error
    // 3. match username and password
    // 4. return response

    // we expect input data to be in such shape
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

    let user;

    try {
      // match username
      user = await User.findOne({ username: username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };

        return next(error);
      }

      // match password
      // req.body.password -> hash -> match

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //const userDto = new UserDTO(user);

    return res.status(200).json({ user: user, auth: true });
  },
  async logout(req, res, next) {
    // 1. delete refresh token from db
    const { refreshToken } = req.cookies;

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },
  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    const originalRefreshToken = req.cookies.refreshToken;

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = RefreshToken.findOne({
        _id: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      const accessToken = JWTService.signAccessToken({ _id: id }, "30m");

      const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

      await RefreshToken.updateOne({ _id: id }, { token: refreshToken });

      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    } catch (e) {
      return next(e);
    }

    const user = await User.findOne({ _id: id });

    //const userDto = new UserDTO(user);

    return res.status(200).json({ user: user, auth: true });
  },

}

export {
    authController
}