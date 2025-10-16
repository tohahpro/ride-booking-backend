import { model, Schema } from "mongoose";
import { IRide } from "./ride.interface";

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
    driverId: { type: Schema.Types.ObjectId, ref: "User" },
    fare: { type: Number },
    timestamps: {
      pickedUpAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
    history: [
      {
        _id: false,
        status: {
          type: String,
          enum: ["requested", "cancelled", "accepted", "picked_up", "in_transit", "completed"],
        },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rideSchema.pre("save", function (next) {
  if (!this.history) this.history = [];
  if (this.history.length === 0 || this.history[this.history.length - 1].status !== this.status) {
    this.history.push({ status: this.status, at: new Date() });
  }
  next();
});

export const Ride = model<IRide>("Ride", rideSchema);