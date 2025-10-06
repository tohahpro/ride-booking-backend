import { Schema } from "mongoose";
import { IRide } from "./ride.interface";
import { model } from "mongoose";


// Ride Schema
const rideSchema = new Schema<IRide>(
  {
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["requested", "cancelled", "accepted", "picked_up", "in_transit", "completed"],
      default: "requested",
    },
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },    
    fare: { type: Number },

    timestamps: {
      pickedUpAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
