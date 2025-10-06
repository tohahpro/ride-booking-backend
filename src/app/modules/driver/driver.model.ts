import { model, Schema } from "mongoose"
import { IDriver, IDriverActivity, vehicle } from "./driver.interface"

const driverSchema = new Schema<IDriver>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    vehicleType: {
        type: String,
        enum: Object.values(vehicle),
        default: vehicle.BIKE,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
)

export const Driver = model<IDriver>("Driver", driverSchema)


const rideSchema = new Schema(
    {
        rideId: {
            type: Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
        },
        status: {
            type: String,
            enum: ["requested", "accepted", "picked_up", "in_transit", "completed", "cancelled"],
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ["requested", "accepted", "picked_up", "in_transit", "completed", "cancelled"],
                    required: true,
                },
                at: { type: Date, required: true },
            },
        ],
        amount: { type: Number },
        commission: { type: Number },
        netEarning: { type: Number },
        completedAt: { type: Date },
        _alreadyCounted: { type: Boolean, default: false },
    },
    { _id: false }
);


rideSchema.pre('save', function (next) {
  if (this.amount != null && this.commission == null) {
    this.commission = Number((this.amount * 0.08).toFixed(2)); 
    this.netEarning = this.amount - this.commission;
  }
  next();
});

const driverActivitySchema = new Schema<IDriverActivity>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
    },
    action: {
      type: String,
      enum: ["accept", "reject"],
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "picked_up", "in_transit", "completed", "cancelled"],
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    completedRides: {
      type: Number,
      default: 0,
    },
    rides: [rideSchema],
  },
  { timestamps: true }
);

export const DriverActivityModel = model<IDriverActivity>("DriverActivity", driverActivitySchema);

