/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import AppError from '../../errorHandlers/AppError';
import { createUserToken } from '../../utils/Jwt/user.token';


const credentialsLogin = async(payload: Partial<IUser>)=>{

    const {email, password}= payload;

    const isUserExist = await User.findOne({email});
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist");
    }

    const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist.password as string);
    if(!isPasswordMatch){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
    }

    const userTokens = createUserToken(isUserExist);

    // delete user password to send in message 
    const {password: pass, ...rest} = isUserExist.toObject()

    return{
        // email: isUserExist.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

};


export const AuthService = {
    credentialsLogin,

}