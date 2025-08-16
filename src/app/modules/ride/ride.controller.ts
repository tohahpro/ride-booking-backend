import httpStatus from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
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

export const RideController = {
  createRideRequest,
};