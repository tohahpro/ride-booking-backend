import httpStatus from 'http-status-codes';
import AppError from "../../errorHandlers/AppError";
import { IRide } from "./ride.interface";
import { Ride } from "./ride.model";


const generateRandomFare = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

 const createRequestRide = async (payload: Partial<IRide>) => {
  if (!payload.riderId) {
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
    ...payload, 
    fare: randomFare,
    requestedAt: new Date()
});

  return ride;
};


export const rideService ={
   createRequestRide,

}