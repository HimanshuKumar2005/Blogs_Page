//this will take a endpoint from the server and on the basis of that we will call the required controller.
import express from "express"
import  {authController} from "../controller/authController.js"
import { auth } from "../middlewares/auth.js";
import blogController from "../controller/blogController.js";
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
router.get('/refresh', authController.refresh)



//blog operations
//create
router.post('/blog', auth, blogController.create);

//get all
router.get('/blog/all', auth, blogController.getAll);

//get blog by id
router.get('/blog/:id', auth, blogController.getById);

//update
router.put('/blog', auth, blogController.update);

//delete
router.delete('/blog/:id', auth, blogController.delete);


//comment
//create

//get

export default router