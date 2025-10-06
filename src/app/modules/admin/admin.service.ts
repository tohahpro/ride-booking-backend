import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHandlers/AppError";
import { UserRole } from "../user/user.interface";



const getAllUser = async () => {
  const users = await User.find({});
  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, "Not any rider or driver");
  }
  const totalCountDriver = await User.countDocuments({ role: UserRole.DRIVER });
  const totalCountRider = await User.countDocuments({ role: UserRole.RIDER });

  return { users: users, meta: { totalCountDriver, totalCountRider } };
};

export const adminServices = {
    getAllUser,
    
}