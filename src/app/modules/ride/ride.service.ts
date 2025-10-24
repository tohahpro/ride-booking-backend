/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";
import { Types } from 'mongoose';
import { DriverActivityModel } from '../driver/driver.model';
import { JwtPayload } from 'jsonwebtoken';


const createRequestRide = async (decodedToken: JwtPayload, payload: Partial<IRide>) => {
  const riderId = decodedToken.userId;

  if (!riderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "RiderId is required to request a ride");
  }
  if (!payload.pickupLocation) {
    throw new AppError(httpStatus.BAD_REQUEST, "Pickup locations are not exists.");
  }
  if (!payload.destinationLocation) {
    throw new AppError(httpStatus.BAD_REQUEST, "Destination locations are not exists.");
  }

  const existingRide = await Ride.findOne({
    riderId,
    status: { $in: ["requested", "cancelled", "accepted", "in_transit", "picked_up"] },
  });

  if (existingRide) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "You already have an active or pending ride request. Please complete or cancel it first.")
  }

  const [lon1, lat1] = payload.pickupLocation.location.coordinates;
  const [lon2, lat2] = payload.destinationLocation.location.coordinates;

  if (!lon1 || !lat1 || !lon2 || !lat2)
    throw new AppError(httpStatus.BAD_REQUEST, "Coordinates সঠিক না");


  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const fareCost = Math.round(distance * 8);


  const ride = await Ride.create({
    riderId,
    ...payload,
    fare: fareCost,
    requestedAt: new Date()
  });

  return ride;
};


const getAllRequestRides = async (query: Record<string, any>) => {
  const rides = await Ride.find(query)
    .sort({ requestedAt: -1 });

  return rides;
};


const cancelRideRequest = async (id: string, payload: Partial<IRide>, decodedToken: JwtPayload) => {

  const existingRide = await Ride.findOne({ _id: id });

  if (!existingRide) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride request not found");
  }

  const rider = await Ride.findOne({ riderId: decodedToken.userId });
  if (!rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  if (existingRide.riderId.toString() !== rider.toString()) {
    throw new AppError(httpStatus.FORBIDDEN, "Driver already accepted. You are not allowed to cancel this ride");
  }

  if (existingRide.status !== "requested") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel, driver already accepted or ride is in progress"
    );
  }

  const updatedRide = await Ride.findByIdAndUpdate(id, payload, { new: true });
  return updatedRide;
};

const setDriverFeedback = async (id: string, payload: Partial<IRide>, decodedToken: JwtPayload) => {
  const ride = await Ride.findById(id);
  if (!ride) {
    throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
  }

  const existRider = await Ride.findOne({ riderId: decodedToken.userId });
  if (!existRider) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  if (ride.riderId.toString() !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to give feedback for this ride"
    );
  }

  const { feedback } = payload

  const driver = ride.driverId

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, "Driver not found for this ride");
  }

  if (!feedback) {
    throw new AppError(httpStatus.BAD_REQUEST, "Feedback is required");
  }

  ride.feedback = feedback;
  await ride.save();

  await DriverActivityModel.updateOne(
    {
      driverId: driver._id,
      "rides.rideId": ride._id,
    },
    {
      $set: { "rides.$.feedback": feedback },
    }
  );
  return ride;
}

const riderHistory = async (decodedToken: JwtPayload) => {
  const rider = await Ride.findOne({ riderId: decodedToken.userId });

  if (!rider) {
    throw new AppError(httpStatus.NOT_FOUND, "Rider not found");
  }

  const history = await Ride.aggregate([
    { $match: { riderId: new Types.ObjectId(decodedToken.userId) } },
    {
      $project: {
        pickupLocation: 1,
        destinationLocation: 1,
        feedback: 1,
        fare: 1,
        status: 1,
        history: 1,
      },
    },
    { $sort: { requestedAt: -1 } },
  ]);

  return history;
};

export const rideService = {
  createRequestRide,
  getAllRequestRides,
  cancelRideRequest,
  riderHistory,
  setDriverFeedback

}