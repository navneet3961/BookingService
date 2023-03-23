const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repository/index");
const axios = require("axios");
const { FLIGHT_REQUEST_URL } = require("../config/serviceConfig");
const { ValidationError, AppError, ServiceError } = require("../utils/index");

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async create(data) {
        try {
            const flightId = data.flightId;
            const flightRequestURL = `${FLIGHT_REQUEST_URL}${flightId}`;
            const response = await axios.get(flightRequestURL);
            const flightData = response.data.data;

            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError("Something went wrong in booking service.", "Insufficient seats in the flight.", StatusCodes.INTERNAL_SERVER_ERROR);
            }

            const totalCost = flightData.price * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };

            const booking = await this.bookingRepository.create(bookingPayload);
            const seatsLeft = flightData.totalSeats - data.noOfSeats;
            const updateResponse = await axios.patch(flightRequestURL, { totalSeats: seatsLeft });
            const changingBookingStatus = await this.bookingRepository.update(booking.id, { status: "Booked" });
            return changingBookingStatus;
        } catch (error) {
            if (error.name == "RepositoryError" || error.name == "ValidationError") {
                throw error;
            }
            throw new ServiceError();
        }
    }

    async update(bookingId, data) {
        try {
            const booking = await this.bookingRepository.update(bookingId, data);
            return booking;
        } catch (error) {
            if (error.name == "RepositoryError" || error.name == "ValidationError") {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;