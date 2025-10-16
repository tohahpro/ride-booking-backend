import { Types } from "mongoose";


export interface IRide {
  pickupLocation: string;
  destinationLocation: string;
  requestedAt: Date;
  status: 'requested' | 'cancelled' | 'accepted' | 'in_transit' | 'completed' | 'picked_up';
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  fare?: number;
  timestamps?: {
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  // history of this ride
  history?: {
    status: IRide["status"];
    at: Date;
  }[];
}


