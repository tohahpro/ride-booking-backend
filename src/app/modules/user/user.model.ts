import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, UserRole } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: {type: String, required: true},
    providerId: {type: String, required: true},
},
{
    _id: false,
    versionKey: false
})


const userSchema = new Schema<IUser>({
    name: {type: String, required: true},
    email: {type: String, required : true, unique:true},
    password: {type: String},
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.RIDER
    },
    phone: { type: String },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isApprove: { type: Boolean, default: false },
    rating: {type: Number, default: 0},
    auths: [authProviderSchema]
},
{
    timestamps: true,
    versionKey: false
})


export const User = model<IUser>('User', userSchema)
