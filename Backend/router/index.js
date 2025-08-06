//this will take a endpoint from the server and on the basis of that we will call the required controller.
import express from "express"
import  {authController} from "../controller/authController.js"
import { auth } from "../middlewares/auth.js";
//import blogController from "../controller/blogController.js"
//import commentController from "../controller/commentController.js"


const router = express.Router();

//User
//register
router.post('/register',authController.register);

//login
router.post('/login', authController.login);

//logout
router.post('/logout',auth, authController.logout)
//refresh
router.post('/refresh', authController.refresh)



//blog operations
//create
//get all
//get blog by id
//update
//delete


//comment
//create

//get

export default router