import Joi from "joi"

const ValidationError = Joi.ValidationError

const errorHandler = (error, req, res, next)=>{
    //default error
    let status = 500
    let data = {
        message : "Internal Server Error"
    }

    if (error instanceof ValidationError){
        status = error.status
        data.message = error.message

        return res.status(status).json(data)
    }

    if(error.status){
        status = error.status
    }

    if(error.message){
        data.message = error.message
    }

    return res.status(status).json(data)
}

export default errorHandler