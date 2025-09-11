"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRepository = void 0;
const mongoose_1 = require("mongoose");
const Booking_model_1 = require("../models/Booking.model");
const base_repository_1 = require("./base.repository");
class BookingRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Booking_model_1.BookingModel);
    }
    async findByTrainerId(trainerId) {
        return await Booking_model_1.BookingModel.find({ trainerId: new mongoose_1.Types.ObjectId(trainerId) })
            .populate('clientId', 'name email')
            .sort({ sessionDate: -1 });
    }
    async findByClientId(clientId) {
        return await Booking_model_1.BookingModel.find({ clientId: new mongoose_1.Types.ObjectId(clientId) })
            .populate('trainerId', 'name email')
            .sort({ sessionDate: -1 });
    }
    async findByTrainerIdAndDateRange(trainerId, startDate, endDate) {
        return await Booking_model_1.BookingModel.find({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            sessionDate: { $gte: startDate, $lte: endDate }
        }).sort({ sessionDate: -1 });
    }
    async getActiveClientsCount(trainerId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const result = await Booking_model_1.BookingModel.aggregate([
            {
                $match: {
                    trainerId: new mongoose_1.Types.ObjectId(trainerId),
                    sessionDate: { $gte: startDate },
                    status: { $in: ['confirmed', 'completed'] }
                }
            },
            {
                $group: {
                    _id: '$clientId'
                }
            },
            {
                $count: 'activeClients'
            }
        ]);
        return result[0]?.activeClients || 0;
    }
    async getSessionsCountByStatus(trainerId, status) {
        return await Booking_model_1.BookingModel.countDocuments({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            status: { $in: status }
        });
    }
    async getSessionsCountByDateRange(trainerId, startDate, endDate, status) {
        return await Booking_model_1.BookingModel.countDocuments({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            sessionDate: { $gte: startDate, $lte: endDate },
            status: { $in: status }
        });
    }
    async getClientTrends(trainerId, startDate, endDate) {
        const result = await Booking_model_1.BookingModel.aggregate([
            {
                $match: {
                    trainerId: new mongoose_1.Types.ObjectId(trainerId),
                    sessionDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$sessionDate' },
                        month: { $month: '$sessionDate' },
                        day: { $dayOfMonth: '$sessionDate' }
                    },
                    uniqueClients: { $addToSet: '$clientId' }
                }
            },
            {
                $project: {
                    _id: 1,
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: {
                                $dateFromParts: {
                                    year: '$_id.year',
                                    month: '$_id.month',
                                    day: '$_id.day'
                                }
                            }
                        }
                    },
                    count: { $size: '$uniqueClients' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);
        return result.map(item => ({
            date: item.date,
            count: item.count
        }));
    }
    async getSessionTrends(trainerId, startDate, endDate, status) {
        const result = await Booking_model_1.BookingModel.aggregate([
            {
                $match: {
                    trainerId: new mongoose_1.Types.ObjectId(trainerId),
                    sessionDate: { $gte: startDate, $lte: endDate },
                    status: { $in: status }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$sessionDate' },
                        month: { $month: '$sessionDate' },
                        day: { $dayOfMonth: '$sessionDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 1,
                    date: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: {
                                $dateFromParts: {
                                    year: '$_id.year',
                                    month: '$_id.month',
                                    day: '$_id.day'
                                }
                            }
                        }
                    },
                    count: 1
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);
        return result.map(item => ({
            date: item.date,
            count: item.count
        }));
    }
}
exports.BookingRepository = BookingRepository;
//# sourceMappingURL=Booking.repository.js.map