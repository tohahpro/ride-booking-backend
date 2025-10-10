import httpStatus from "http-status-codes";
import { User } from "../user/user.model";
import AppError from "../../errorHandlers/AppError";
import { IsActive, UserRole } from "../user/user.interface";
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

const changeIsApproveStatus = async (userId: string) => {
  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, "Id not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Not Found");
  }
  if (user.role !== UserRole.DRIVER) {
    throw new AppError(httpStatus.NOT_FOUND, "This Action only for driver role");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isApprove: !user?.isApprove },
    { new: true, runValidators: true }
  ).select("name email isApproved");

  return updatedUser;
};

const updateActiveStatus = async (userId: string, isActive: IsActive) => {
  if (!userId) {
    throw new AppError(httpStatus.NOT_FOUND, "User id not found");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }
  if (user.role == UserRole.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "Can't block admin");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true }
  ).select("name email role status");

  return updatedUser;
};

export const adminServices = {
  getAllUser,
  getAllRide,
  changeIsApproveStatus,
  updateActiveStatus,

}