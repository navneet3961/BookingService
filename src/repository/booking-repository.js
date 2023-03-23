const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models/index");
const { ValidationError, AppError, ServiceError } = require("../utils/index");

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            console.log(error);
            if (error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }

            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId, data) {
        try {
            const booking = await Booking.update(data, {
                where: {
                    id: bookingId
                }
            });
            return booking;
        } catch (error) {
            console.log(error);
            if (error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }

            throw new AppError(
                'RepositoryError',
                'Cannot update booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

module.exports = BookingRepository;