const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");
const { ValidationError, AppError, ServiceError } = require("../utils/index");

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            data: response,
            success: true,
            message: "Succesfully completed booking",
            err: {}
        })
    } catch (error) {
        return res.status(error.statusCode).json({
            data: {},
            success: false,
            message: error.message,
            err: error.explanation
        })
    }
}

module.exports =
{
    create,
}