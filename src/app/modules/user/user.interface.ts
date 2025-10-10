import { Types } from "mongoose";

export enum UserRole {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'admin',
    RIDER = 'rider',
    DRIVER = 'driver'
}


export interface IAuthProvider {
    provider: 'google' | 'credentials';
    providerId?: string;
}


export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}


export interface IUser {
    _id: string;
    name: string;
    email: string;
    password?: string;
    phone ?: string;
    isActive?: IsActive;
    isVerified?: boolean;
    isApprove: boolean;
    rating?: number;
    role?: UserRole;
    auths: IAuthProvider[];
    booking?: Types.ObjectId[];
}

