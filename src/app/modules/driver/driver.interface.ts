import { Types } from "mongoose";

export interface DriverRideAction {
    rideId: Types.ObjectId;
    driverId: Types.ObjectId;
    action: 'accept' | 'reject';
    status?: 'picked_up' | 'in_transit' | 'completed';
}


export interface DriverEarningsHistory {
    driverId: Types.ObjectId;
    totalEarnings: number;
    completedRides: number;
        earningsByRide: {
            rideId: Types.ObjectId[];
            amount: number;
            completedAt: Date;
        }[];
}


export interface DriverAvailability {
    driverId: Types.ObjectId;
    isOnline: boolean;
}
