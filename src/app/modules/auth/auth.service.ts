/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from '../../errorHandlers/AppError';
import { createUserToken } from '../../utils/Jwt/user.token';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';


const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
    }

    const userTokens = createUserToken(isUserExist);

    // delete user password to send in message 
    const { password: pass, ...rest } = isUserExist.toObject()

    return {
        // email: isUserExist.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

};

const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user?.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password dose not matched")
    }

    user.password = await bcryptjs.hash(newPassword as string, Number(envVars.BCRYPT_SALT_ROUND));
    user.save();
}


export const AuthService = {
    credentialsLogin,
    changePassword,
    
}