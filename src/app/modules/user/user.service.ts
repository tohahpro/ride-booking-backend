import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { IAuthProvider, IDriver, IUser, UserRole } from "./user.interface";
import { Driver, User } from "./user.model";
import bcryptjs from 'bcryptjs';
import { envVars } from '../../config/env';
import { Types } from 'mongoose';


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


const createDriver = async (payload: Partial<IDriver>) => {
    if (!payload.userId) {
        throw new Error("UserId is required to create a driver");
    }

    const user = await User.findById(payload.userId);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== UserRole.DRIVER) {
        user.role = UserRole.DRIVER;
        await user.save();
    }

    const driver = await Driver.create({
        userId: new Types.ObjectId(payload.userId),
        ...payload
    });

    return driver;
}


export const UserService = {
    createUser,
    createDriver
}