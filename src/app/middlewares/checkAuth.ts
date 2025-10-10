import httpStatus from 'http-status-codes';
import AppError from "../errorHandlers/AppError"
import { User } from "../modules/user/user.model"
import { verifyToken } from "../utils/Jwt/jwt"
import { envVars } from '../config/env';
import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }

        const verifiedToken = verifyToken(
            accessToken,
            envVars.JWT_ACCESS_SECRET
        ) as JwtPayload

        if (!verifiedToken) {
            throw new AppError(403, "You are not authorized");
        }

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
        }
        if (isUserExist.isBlocked) {
            throw new AppError(httpStatus.BAD_REQUEST, "You are Blocked");
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not Permitted to view this route!!")
        }
        req.user = verifiedToken
        next()

    } catch (error) {
        next(error)
    }
}