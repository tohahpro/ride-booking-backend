import { Types } from "mongoose";

export type RideStatus = 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
export type DriverAction = 'accept' | 'reject';

export interface IDriverActivity {
  driverId: Types.ObjectId;
  rideId?: Types.ObjectId;
  action?: DriverAction;
  status?: RideStatus;
  totalEarnings: number;
  completedRides: number;
  rides: {
    rideId: Types.ObjectId;
    status?: RideStatus;
    statusHistory?: {
      status: RideStatus;
      at: Date;
    }[];
    amount?: number;
    commission?: number;
    netEarning?: number;
    feedback?: string;
    completedAt?: Date;
    _alreadyCounted?: boolean;
  }[];
}


export enum vehicle {
    CAR = "CAR",
    BIKE = "BIKE",
    CNG = "CNG"
}

export interface IDriver {
    userId: Types.ObjectId;
    vehicleType: vehicle;
    vehicleNumber: string;
    licenseNumber: string;
    isOnline: boolean;
}
