"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = require("mongoose");
const BookingSchema = new mongoose_1.Schema({
    trainerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.BookingModel = (0, mongoose_1.model)('Booking', BookingSchema);
//# sourceMappingURL=Booking.model.js.map