import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { adminServices } from "./admin.service";


const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllUser();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "Get All rider or driver",
  });
});

const getAllRide = catchAsync(async (req: Request, res: Response) => {
  const result = await adminServices.getAllRide();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "All ride retrieved successful",
  });
});

export const adminController = {
    getAllUser,
    getAllRide,

}