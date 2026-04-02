const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "OTP already exists for this email"]
    },
    otp: {
        type: String,
        required: [true, "OTP is required"]
    },
    expiresAt: {
        type: Date,
        required: [true, "Expiry time is required"],
        default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        index: { expireAfterSeconds: 0 } // Auto-delete after expiry
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const otpModel = mongoose.model("otps", otpSchema)

module.exports = otpModel
