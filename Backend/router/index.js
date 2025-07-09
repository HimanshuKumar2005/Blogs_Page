//this will take a endpoint from the server and on the basis of that we will call the required controller.
import express from "express"
import authController from "../controller/authController.js"
import blogController from "../controller/blogController.js"
import commentController from "../controller/commentController.js"


const router = express.Router();

//User
//register
router.post('/register',authController.register);
//login
//logout
//refresh


//blog operations
//create
//get all
//get blog by id
//update
//delete


//comment
//create

//get