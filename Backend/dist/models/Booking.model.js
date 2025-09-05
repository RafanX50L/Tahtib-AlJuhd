import { Schema, model } from 'mongoose';
const BookingSchema = new Schema({
    trainerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
        max: 480
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    stripePaymentIntentId: {
        type: String
    },
    stripeSessionId: {
        type: String
    },
    meetingLink: {
        type: String
    },
    notes: {
        type: String
    },
    cancellationReason: {
        type: String
    },
    cancelledBy: {
        type: String,
        enum: ['trainer', 'client', 'admin']
    }
}, {
    timestamps: true
});
// Indexes for better query performance
BookingSchema.index({ trainerId: 1, sessionDate: 1 });
BookingSchema.index({ clientId: 1, sessionDate: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });
export const BookingModel = model('Booking', BookingSchema);
//# sourceMappingURL=Booking.model.js.map