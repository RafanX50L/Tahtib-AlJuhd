"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardService = void 0;
class TrainerDashboardService {
    paymentRepo;
    personalizationRepo;
    bookingRepo;
    planRepo;
    constructor(paymentRepo, personalizationRepo, bookingRepo, planRepo) {
        this.paymentRepo = paymentRepo;
        this.personalizationRepo = personalizationRepo;
        this.bookingRepo = bookingRepo;
        this.planRepo = planRepo;
    }
    async getTrainerDashboardStats(trainerId) {
        try {
            // Validate trainer ID format
            if (!trainerId || typeof trainerId !== 'string') {
                throw new Error('Invalid trainer ID');
            }
            // Get current date for today's sessions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            // Get start of current month for monthly revenue
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            // Get start of current week for weekly sessions
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            // Parallel queries for better performance
            const [activeClientsCount, sessionsTodayCount, totalRevenue, completedSessionsCount, monthlyRevenue, weeklySessionsCount, averageRating] = await Promise.all([
                // Active clients (clients with bookings in last 30 days)
                // this.bookingRepo.getActiveClientsCount(trainerId, 30),
                this.planRepo.countActiveClinetByTrainer(trainerId),
                // Sessions today
                this.bookingRepo.getSessionsCountByDateRange(trainerId, today, tomorrow, ['confirmed', 'completed']),
                // Total revenue (all time) - using PaymentCollection
                this.paymentRepo.getTotalRevenueByTrainer(trainerId),
                // Completed sessions (all time)
                this.bookingRepo.getSessionsCountByStatus(trainerId, ['completed']),
                // Monthly revenue - using PaymentCollection
                this.getMonthlyRevenue(trainerId, startOfMonth),
                // Weekly sessions
                this.bookingRepo.getSessionsCountByDateRange(trainerId, startOfWeek, new Date(), ['confirmed', 'completed']),
                // Average rating from trainer personalization
                this.getAverageRating(trainerId)
            ]);
            const stats = {
                activeClients: activeClientsCount,
                sessionsToday: sessionsTodayCount,
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                completedSessions: completedSessionsCount,
                averageRating: averageRating,
                monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
                weeklySessions: weeklySessionsCount
            };
            return stats;
        }
        catch (error) {
            console.error('Error fetching trainer dashboard stats:', error);
            throw new Error('Failed to fetch trainer dashboard statistics');
        }
    }
    async getTrainerPerformanceTrends(trainerId, period = 'month') {
        try {
            // Validate trainer ID format
            if (!trainerId || typeof trainerId !== 'string') {
                throw new Error('Invalid trainer ID');
            }
            // Validate period
            if (!['week', 'month', 'quarter'].includes(period)) {
                throw new Error('Invalid period. Must be week, month, or quarter');
            }
            const { startDate, endDate, intervals } = this.getDateRange(period);
            // Get trends data using repository methods
            const [revenueData, reviewData, clientData, sessionData] = await Promise.all([
                this.getRevenueTrends(trainerId, startDate, endDate, intervals),
                this.getReviewTrends(trainerId, startDate, endDate, intervals),
                this.getClientTrends(trainerId, startDate, endDate, intervals),
                this.getSessionTrends(trainerId, startDate, endDate, intervals)
            ]);
            return {
                revenue: {
                    ...revenueData,
                    data: revenueData.data.map(value => Math.round(value * 100) / 100)
                },
                reviews: {
                    ...reviewData,
                    data: reviewData.data.map(value => Math.round(value * 10) / 10)
                },
                clients: {
                    ...clientData,
                    data: clientData.data.map(value => Math.round(value))
                },
                sessions: {
                    ...sessionData,
                    data: sessionData.data.map(value => Math.round(value))
                }
            };
        }
        catch (error) {
            console.error('Error fetching trainer performance trends:', error);
            throw new Error('Failed to fetch trainer performance trends');
        }
    }
    // Helper methods
    async getMonthlyRevenue(trainerId, startOfMonth) {
        const payments = await this.paymentRepo.findByTrainerId(trainerId);
        return payments
            .filter(payment => payment.paymentStatus === 'completed' &&
            payment.createdAt >= startOfMonth)
            .reduce((sum, payment) => sum + payment.amount, 0);
    }
    async getAverageRating(trainerId) {
        const trainerPersonalization = await this.personalizationRepo.findByUserId(trainerId);
        if (!trainerPersonalization || !trainerPersonalization.data) {
            return 0;
        }
        const trainerData = trainerPersonalization.data;
        const ratings = trainerData.ratings || [];
        if (ratings.length === 0) {
            return 0;
        }
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return Math.round((totalRating / ratings.length) * 10) / 10;
    }
    getDateRange(period) {
        const now = new Date();
        const endDate = new Date(now);
        let startDate;
        let intervals;
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                intervals = this.getLast7Days();
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                intervals = this.getLast4Weeks();
                break;
            case 'quarter':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 3);
                intervals = this.getLast3Months();
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                intervals = this.getLast7Days();
        }
        return { startDate, endDate, intervals };
    }
    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    }
    getLast4Weeks() {
        const weeks = [];
        for (let i = 3; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            weeks.push(`Week ${4 - i}`);
        }
        return weeks;
    }
    getLast3Months() {
        const months = [];
        for (let i = 2; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
        }
        return months;
    }
    async getRevenueTrends(trainerId, startDate, endDate, intervals) {
        const payments = await this.paymentRepo.findByTrainerId(trainerId);
        const filteredPayments = payments.filter(payment => payment.paymentStatus === 'completed' &&
            payment.createdAt >= startDate &&
            payment.createdAt <= endDate);
        // Group by date and sum amounts
        const revenueByDate = new Map();
        filteredPayments.forEach(payment => {
            const dateStr = payment.createdAt.toISOString().split('T')[0];
            revenueByDate.set(dateStr, (revenueByDate.get(dateStr) || 0) + payment.amount);
        });
        const data = intervals.map(() => 0);
        intervals.forEach((interval, index) => {
            if (interval.includes('-')) { // Date format
                data[index] = revenueByDate.get(interval) || 0;
            }
        });
        return { labels: intervals, data };
    }
    async getReviewTrends(trainerId, startDate, endDate, intervals) {
        // Get average rating for the period - for now return static data since ratings don't have timestamps
        // In a real implementation, you'd have a separate reviews collection with timestamps
        const averageRating = await this.getAverageRating(trainerId);
        const data = intervals.map(() => averageRating || 0);
        return { labels: intervals, data };
    }
    async getClientTrends(trainerId, startDate, endDate, intervals) {
        const clientTrends = await this.bookingRepo.getClientTrends(trainerId, startDate, endDate);
        // Map client data to intervals
        const data = intervals.map(() => 0);
        clientTrends.forEach(trend => {
            const index = intervals.findIndex(interval => interval.includes(trend.date) || interval === trend.date);
            if (index !== -1) {
                data[index] = trend.count;
            }
        });
        return { labels: intervals, data };
    }
    async getSessionTrends(trainerId, startDate, endDate, intervals) {
        const sessionTrends = await this.bookingRepo.getSessionTrends(trainerId, startDate, endDate, ['confirmed', 'completed']);
        // Map session data to intervals
        const data = intervals.map(() => 0);
        sessionTrends.forEach(trend => {
            const index = intervals.findIndex(interval => interval.includes(trend.date) || interval === trend.date);
            if (index !== -1) {
                data[index] = trend.count;
            }
        });
        return { labels: intervals, data };
    }
}
exports.TrainerDashboardService = TrainerDashboardService;
//# sourceMappingURL=TrainerDashboard.service.js.map