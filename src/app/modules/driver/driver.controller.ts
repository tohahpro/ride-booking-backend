/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { driverService } from './driver.service';



const createDriver = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const driver = await driverService.createDriver(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Driver created successfully",
        data: driver,
    });
});


const updateRideStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {   
        const { driverId, status } = req.body;
        const rideId = req.params?.id || req.body?.rideId;
        if (!driverId || !rideId || !status) {
            res.status(400).json({ message: "driverId, rideId and status are required" });
            return;
        }

        const result = await driverService.updateRideStatus(rideId, { driverId, status } as any);

        res.status(200).json({
            success: true,
            message: "Ride status updated successfully",
            data: result,
        });
});


const driverAction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rideId = req.params?.id || req.body?.rideId;
    const { driverId, action } = req.body || {};

    if (!rideId || !driverId || !action) {
        res.status(400).json({ message: "rideId, driverId and action are required" });
        return;
    }

    const result = await driverService.driverAction(rideId, { driverId, action } as any);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: action === 'accept' ? 'Ride accepted successfully' : 'Ride rejected successfully',
        data: result,
      });
});

const getDriverHistory = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.params.id
    const result = await driverService.driverHistory(driverId);
    
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      data: result,
      message: "Driver history retrieved successful",
    });
  }
);

const changeOnlineStatus = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;
  const result = await driverService.changeOnlineStatus(driverId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Changed Online status",
    data: result,
  });
});

export const driverController ={
    createDriver,
    updateRideStatus,
    driverAction,
    getDriverHistory,
    changeOnlineStatus
}