/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { TErrorSources } from "../interfaces/error.types";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/validationError";
import AppError from "../errorHandlers/AppError";

export const globalErrorHandler = async(err:any, req: Request, res:Response, next: NextFunction)=>{
    
    let statusCode = 500
    let message= `something went wrong!!`



    let errorSources : TErrorSources[]= []

    // Duplicate 
    if(err.code === 11000){
        // const duplicate = err.message.match(/"([^"]*)"/)
        const simplifiedError = handleDuplicateError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // ObjectId / CastError 
    else if(err.name === 'CastError'){
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Zod Error
    else if(err.name === "ZodError"){
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = handleValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        // err: envVars.NODE_ENV === "development" ? err : null,
        // stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}
