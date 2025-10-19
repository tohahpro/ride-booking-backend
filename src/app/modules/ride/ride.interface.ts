import { Types } from "mongoose";

export interface IGeoJSONPoint extends Document {
  type: "Point";
  coordinates: [number, number];
}
export interface ILocation {
  location: IGeoJSONPoint;
  address: string;
}

export interface IRide {
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  requestedAt: Date;
  status: 'requested' | 'cancelled' | 'accepted' | 'in_transit' | 'completed' | 'picked_up';
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  fare?: number;  
  feedback?: string;
  timestamps?: {
    pickedUpAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };

  history?: {
    status: IRide["status"];
    at: Date;
  }[];
}


