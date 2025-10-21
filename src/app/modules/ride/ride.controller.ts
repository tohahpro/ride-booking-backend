/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rideService } from "./ride.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from 'jsonwebtoken';


const createRideRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    const result = await rideService.createRequestRide(decodedToken as JwtPayload, req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Ride requested successfully",
      data: result,
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
    const decodedToken = req.user;

    const updatedRide = await rideService.cancelRideRequest(rideId, payload, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Ride cancelled successfully",
      data: updatedRide,
    });
  }
);

const setDriverFeedback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; 
    const decodedToken = req.user;
    const result = await rideService.setDriverFeedback(id, req.body, decodedToken as JwtPayload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Driver feedback set successfully",
      data: result,
    });
  }
);


const getRiderHistory = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user;
  const result = await rideService.riderHistory(decodedToken as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    data: result,
    message: "Rider history retrieved successful",
  });
}
);

export const RideController = {
  createRideRequest,
  getAllRideRequests,
  cancelRideRequest,
  getRiderHistory,
  setDriverFeedback
};