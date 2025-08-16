import { Types } from "mongoose";


export interface RideRequest {
    pickupLocation: string;
    destinationLocation: string;
    requestedAt: Date;
    status: 'requested' | 'cancelled' | 'accepted' | 'in_transit' | 'completed';
    riderId: Types.ObjectId;
    driverId: Types.ObjectId;
    fare?: number;
    timestamps?: {
        pickedUpAt?: Date;
        completedAt?: Date;
        cancelledAt?: Date;
    };
}


export interface RideHistory {
    rides: RideRequest[];
}


