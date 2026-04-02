const userModel = require("../models/user.model")
const otpModel = require("../models/otp.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message: "Account already exists with this email address or username",
            error: "DUPLICATE_EMAIL_OR_USERNAME"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
})


    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None"
})
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name forgotPasswordController
 * @description Send OTP to user email for password reset
 * @access public
 */
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Please provide email address",
                error: "MISSING_EMAIL"
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found with this email",
                error: "USER_NOT_FOUND"
            })
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        
        // Delete existing OTP for this email if any
        await otpModel.deleteOne({ email })
        
        // Store OTP in database with 10-minute expiry
        await otpModel.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        })

        // In development: log OTP for testing
        console.log(`OTP for ${email}: ${otp}`)
        
        // TODO: In production, send OTP via email using nodemailer or SendGrid
        // await sendOtpEmail(email, otp)

        res.status(200).json({
            message: "OTP sent to your email",
            // In development only - remove in production
            debug_otp: process.env.NODE_ENV === 'development' ? otp : undefined
        })
    } catch (err) {
        console.error("Forgot password error:", err)
        res.status(500).json({
            message: "Error sending OTP",
            error: "INTERNAL_SERVER_ERROR"
        })
    }
}

/**
 * @name resetPasswordController
 * @description Reset user password with OTP verification
 * @access public
 */
async function resetPasswordController(req, res) {
    try {
        const { email, otp, newPassword } = req.body

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Please provide email, OTP, and new password",
                error: "MISSING_FIELDS"
            })
        }

        // Verify OTP exists in database and hasn't expired
        const otpRecord = await otpModel.findOne({ email, otp })

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                error: "INVALID_OTP"
            })
        }

        // Check if OTP has expired
        if (new Date() > otpRecord.expiresAt) {
            await otpModel.deleteOne({ _id: otpRecord._id })
            return res.status(400).json({
                message: "OTP has expired. Please request a new one.",
                error: "OTP_EXPIRED"
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: "USER_NOT_FOUND"
            })
        }

        // Hash new password
        const hash = await bcrypt.hash(newPassword, 10)

        // Update user password
        await userModel.findByIdAndUpdate(user._id, {
            password: hash
        })

        // Delete OTP after successful password reset
        await otpModel.deleteOne({ _id: otpRecord._id })

        res.status(200).json({
            message: "Password reset successfully"
        })
    } catch (err) {
        console.error("Reset password error:", err)
        res.status(500).json({
            message: "Error resetting password",
            error: "INTERNAL_SERVER_ERROR"
        })
    }
}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    forgotPasswordController,
    resetPasswordController
}