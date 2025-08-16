/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { UserService } from "./user.service"
import { sendResponse } from "../../utils/sendResponse"

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{
    const user = await UserService.createUser(req.body)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'User created successfully',
        data : user
    })
})

const createDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = await UserService.createDriver(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Driver created successfully",
        data: driver,
    });
});

export const UserController ={
    createUser,
    createDriver,
    
}