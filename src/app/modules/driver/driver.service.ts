import httpStatus, { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";
import { UserRole } from "../user/user.interface";
import { User } from "../user/user.model";
import { Driver, DriverActivityModel } from "./driver.model";
import { IDriver, IDriverActivity } from "./driver.interface";
import { Ride } from "../ride/ride.model";
import AppError from "../../errorHandlers/AppError";


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

const driverAction = async (id: string, payload: IDriverActivity) => {
    const rideId = id;
    const action = payload.action;
    const payloadDriverId = payload.driverId;
    if (!payloadDriverId) throw new Error('DriverId is required');

    const driver = await Driver.findById(payloadDriverId);
    if (!driver) throw new AppError(401, 'Driver not found');
    if (!driver.isOnline) throw new AppError(401, 'Driver is offline');

    const ride = await Ride.findById(rideId);
    if (!ride) throw new AppError(401, 'Ride not found');

    const activeRide = await Ride.findOne({
        driverId: driver._id,
        status: { $in: ["accept", "accepted"] },
    });

    if (activeRide && activeRide._id.toString() !== rideId) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Driver already has an accepted ride.");
    }

    let activity = await DriverActivityModel.findOne({ driverId: driver._id });
    if (!activity) {
        activity = new DriverActivityModel({
            driverId: driver._id,
            totalEarnings: 0,
            completedRides: 0,
            rides: [],
        });
    }

    if (action === 'accept') {
        ride.status = 'accepted' as any;
        (ride as any).driverId = new Types.ObjectId(driver._id);
        await ride.save();

        let rideActivity: any = activity.rides.find(r => r.rideId?.toString() === rideId);
        if (!rideActivity) {
            rideActivity = {
                rideId: ride._id,
                amount: (ride as any).fare || 0,
                status: 'accepted',
                statusHistory: [{ status: 'accepted', at: new Date() }],
            };
            activity.rides.push(rideActivity);
        } else {
            rideActivity.status = 'accepted';
            if (!rideActivity.statusHistory) rideActivity.statusHistory = [];
            rideActivity.statusHistory.push({ status: 'accepted', at: new Date() });
        }

        (activity as any).rideId = ride._id;
        (activity as any).action = 'accept';
        await activity.save();

        return { message: 'Ride accepted', rideId: ride._id, driverId: driver._id, activity };
    }

    if (action === 'reject') {
        (activity as any).rideId = ride._id;
        (activity as any).action = 'reject';
        await activity.save();
        return { message: 'Ride rejected', rideId: ride._id, driverId: driver._id, activity };
    }
    throw new AppError(400, 'Invalid action. Must be either accept or reject');
};

const updateRideStatus = async (id: string, payload: IDriverActivity) => {
    const rideId = id;
    const driverId = (payload.driverId as unknown) as Types.ObjectId | string | undefined;
    const status = payload.status as any;

    if (!driverId) throw new AppError(400, 'DriverId is required');
    if (!status) throw new AppError(400, 'Status is required');

    const driver = await Driver.findById(driverId);
    if (!driver) throw new AppError(404, 'Driver not found');
    if (!driver.isOnline) throw new AppError(403, 'Driver is offline');

    const ride = await Ride.findById(rideId);
    if (!ride) throw new AppError(404, 'Ride not found');

    ride.status = status;
    if (!ride.timestamps) (ride as any).timestamps = {};
    if (status === 'picked_up') (ride as any).timestamps.pickedUpAt = new Date();
    if (status === 'completed') (ride as any).timestamps.completedAt = new Date();
    if (status === 'cancelled') (ride as any).timestamps.cancelledAt = new Date();
    await ride.save();

    const activity = await DriverActivityModel.findOne({ driverId: driver._id });
    if (!activity) throw new AppError(404, 'Driver activity not found');

    const rideActivity: any = activity.rides.find(r => r.rideId?.toString() === rideId);
    if (!rideActivity) throw new AppError(404, 'Ride activity not found for this ride');

    if (status === 'completed') {
        const amount = (rideActivity.amount ?? (ride as any).fare) || 0;
        const netEarning = amount;
        rideActivity.completedAt = new Date();
        if (!rideActivity._alreadyCounted) {
            activity.totalEarnings += netEarning;
            activity.completedRides += 1;
            rideActivity._alreadyCounted = true;
        }
    }

    rideActivity.status = status;
    if (!rideActivity.statusHistory) rideActivity.statusHistory = [];
    rideActivity.statusHistory.push({ status, at: new Date() });

    await activity.save();

    return {
        message: `Ride is to ${status}`,
        rideId: ride._id,
        driverId: driver._id,
        status,
        activity,
    };
};



const driverHistory = async (driverId: string) => {
    const history = await DriverActivityModel.aggregate([
        { $match: { driverId: new Types.ObjectId(driverId) } },
        {
            $project: {
                _id: 0,
                totalEarnings: 1,
                completedRides: 1
            },
        },
    ]);

    if (!history || history.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver history not found");
    }
    const data = history[0];

    return {
        totalEarnings: data.totalEarnings,
        completedRides: data.completedRides
    };
};


const changeOnlineStatus = async (driverId: string) => {

    const driver = await Driver.findById(driverId);
    if (!driver) {
        throw new AppError(httpStatus.NOT_FOUND, "Driver not Found");
    }
    const updatedDriver = await Driver.findByIdAndUpdate(
        driverId,
        { isOnline: !driver?.isOnline },
        { new: true, runValidators: true }
    )
    return updatedDriver;
};

export const driverService = {
    createDriver,
    driverAction,
    updateRideStatus,
    driverHistory,
    changeOnlineStatus
}
