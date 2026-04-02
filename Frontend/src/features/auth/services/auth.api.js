import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Registration failed. Please try again."
        const errorCode = err.response?.data?.error || "REGISTRATION_ERROR"
        console.error("Register error:", err)
        throw {
            message: errorMessage,
            code: errorCode,
            status: err.response?.status
        }
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Login failed. Please try again."
        const errorCode = err.response?.data?.error || "LOGIN_ERROR"
        console.error("Login error:", err)
        throw {
            message: errorMessage,
            code: errorCode,
            status: err.response?.status
        }
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function forgotPassword({ email }) {

    try {

        const response = await api.post("/api/auth/forgot-password", {
            email
        })

        return response.data

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again."
        const errorCode = err.response?.data?.error || "FORGOT_PASSWORD_ERROR"
        console.error("Forgot password error:", err)
        throw {
            message: errorMessage,
            code: errorCode,
            status: err.response?.status
        }
    }

}

export async function resetPassword({ email, otp, newPassword }) {

    try {

        const response = await api.post("/api/auth/reset-password", {
            email, otp, newPassword
        })

        return response.data

    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again."
        const errorCode = err.response?.data?.error || "RESET_PASSWORD_ERROR"
        console.error("Reset password error:", err)
        throw {
            message: errorMessage,
            code: errorCode,
            status: err.response?.status
        }
    }

}