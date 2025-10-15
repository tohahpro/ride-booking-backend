/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { UserService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse"
import { JwtPayload } from 'jsonwebtoken';

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User created successfully',
        data: user
    })
})

const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserService.getMe(decodedToken.userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        data: result,
        message: "Profile Retrieved Successfully",
    });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    
    const userId = req.params.id;
    
    const verifiedToken = req.user
    const payload = req.body

    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User Updated successfully',
        data : user
    })
})

export const UserController = {
    createUser,
    getMe,
    updateUser,
    

}