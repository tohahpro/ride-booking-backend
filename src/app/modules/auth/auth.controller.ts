/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from '../../errorHandlers/AppError';
import { createUserToken } from '../../utils/Jwt/user.token';
import { setAuthCookie } from '../../utils/Jwt/setCookie';
import passport from 'passport';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jsonwebtoken';


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await AuthService.credentialsLogin(req.body);

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {
            return next(new AppError(401, err))
        }

        if (!user) {
            return next(new AppError(401, info.message))
        }

        const userTokens = await createUserToken(user)

        const { password: pass, ...rest } = user.toObject()

        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User Logged In successfully',
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        })
    })(req, res, next)


});


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged out successfully',
        data: null
    })

})


const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction)=>{

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthService.changePassword(oldPassword,newPassword, decodedToken as JwtPayload)

    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password changed successfully',
        data : null
    })
})

export const AuthControllers = {
    credentialsLogin,
    logout,
    changePassword,

}