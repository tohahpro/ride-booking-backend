/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";


const credentialsLogin = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const loginInfo = await AuthService.credentialsLogin(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User Logged In successfully',
        data : loginInfo
    })
})

export const AuthControllers ={
    credentialsLogin
}