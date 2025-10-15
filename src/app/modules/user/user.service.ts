import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { IAuthProvider, IUser, UserRole } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from 'bcryptjs';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user
}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");

    return {
        data: user
    }
};


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.sub !== userId) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }
    const ifUserExist = await User.findById(userId)

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    if (decodedToken.role !== UserRole.ADMIN) {
        const adminRestricted = ["isBlocked", "isVerified", "isApprove", "role"];
        const triedToUpdate = adminRestricted.find(field => field in payload);
        if (triedToUpdate) {
            throw new AppError(403, `Only admin can update '${triedToUpdate}' field`);
        }
    }
    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

export const UserService = {
    createUser,
    getMe,
    updateUser
}