import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHandlers/AppError";
import { UserRole } from "../user/user.interface";
import { Ride } from "../ride/ride.model";



const getAllUser = async () => {
  const users = await User.find({});
  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, "Not any rider or driver");
  }
  const totalCountDriver = await User.countDocuments({ role: UserRole.DRIVER });
  const totalCountRider = await User.countDocuments({ role: UserRole.RIDER });

  return { users: users, meta: { totalCountDriver, totalCountRider } };
};

const getAllRide = async () => {
  const rides = await Ride.find({});
  if (!rides) {
    throw new AppError(httpStatus.NOT_FOUND, "Not any ride");
  }
  const totalCount = await Ride.countDocuments();

  return { data: rides, meta: totalCount };
};

export const adminServices = {
    getAllUser,
    getAllRide,

}