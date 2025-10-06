/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rideService } from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";


const createRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ride = await rideService.createRequestRide(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride requested successfully",
      data: ride,
    });
  }
);

const getAllRideRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rides = await rideService.getAllRequestRides(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride requests retrieved successfully",
      data: rides,
    });
  }
);


const cancelRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params.id;
    const payload = req.body;

    const updatedRide = await rideService.cancelRideRequest(rideId, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride cancelled successfully",
      data: updatedRide,
    });
  }
);


export const RideController = {
  createRideRequest,
  getAllRideRequests,
  cancelRideRequest
};