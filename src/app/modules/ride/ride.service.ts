/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { Types } from 'mongoose';


const generateRandomFare = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

 const createRequestRide = async (riderId: string, payload: Partial<IRide>) => {
  if (!riderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "RiderId is required to request a ride");
  }
  if (!payload.pickupLocation) {
    throw new AppError(httpStatus.BAD_REQUEST, "Pickup locations are not exists.");
  }
  if (!payload.destinationLocation) {
    throw new AppError(httpStatus.BAD_REQUEST, "Destination locations are not exists.");
  }

  const randomFare = generateRandomFare(50, 1500);

  const ride = await Ride.create({ 
    riderId,
    ...payload, 
    fare: randomFare,
    requestedAt: new Date()
});

  return ride;
};


const getAllRequestRides = async (query: Record<string, any>) => {
  const rides = await Ride.find(query)  
    .sort({ requestedAt: -1 });

  return rides;
};


const cancelRideRequest = async (id: string, payload : Partial<IRide>) => {

  const existingRide = await Ride.findOne({ _id: id });

  if (!existingRide) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride request not found");
  }

  const rider = payload.riderId;
  if (!rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  if (existingRide.riderId.toString() !== rider.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to cancel this ride");
  }

  if (existingRide.status !== "requested") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel, driver already accepted or ride is in progress"
    );
  }

  const updatedRide = await Ride.findByIdAndUpdate(id, payload , { new: true });
  return updatedRide;
};


export const riderHistory = async (riderId: string) => {
  if (!Types.ObjectId.isValid(riderId)) {
    throw new Error("Rider is not exists");
  }
  const history = await Ride.aggregate([
    { $match: { riderId: new Types.ObjectId(riderId) } },
    {
      $project: {
        pickupLocation: 1,
        destinationLocation: 1,
        fare: 1,
        status: 1,
        history: 1,
      },
    },
    { $sort: { requestedAt: -1 } },
  ]);

  return history;
};

export const rideService ={
   createRequestRide,
   getAllRequestRides,
   cancelRideRequest,
   riderHistory

}