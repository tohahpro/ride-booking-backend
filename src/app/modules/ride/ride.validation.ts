import z from "zod";

export const rideRequestZodSchema = z.object({
    pickupLocation: z.object({
        location: z.object({
            type: z.literal("Point"),
            coordinates: z.array(z.number()).length(2),
        }),
        address: z.string().min(5, "Address must be at least 5 characters long."),
    }),
    destinationLocation: z.object({
        location: z.object({
            type: z.literal("Point"),
            coordinates: z.array(z.number()).length(2),
        }),
        address: z.string().min(5, "Address must be at least 5 characters long."),
    })

});
 