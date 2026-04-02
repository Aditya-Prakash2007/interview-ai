import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { forgotPassword, resetPassword } from '../services/auth.api'

const Login = () => {

    const { loading, handleLogin, error, setError } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [forgotEmail, setForgotEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [resetStep, setResetStep] = useState(1) // 1: email, 2: otp, 3: new password
    const [resetError, setResetError] = useState("")
    const [resetLoading, setResetLoading] = useState(false)
    const [resetSuccess, setResetSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result.success) {
            navigate('/')
        }
    }

    const handleForgotPasswordClick = async (e) => {
        e.preventDefault()
        setResetError("")
        setResetSuccess("")
        setResetLoading(true)

        if (resetStep === 1) {
            // Send OTP
            try {
                const response = await forgotPassword({ email: forgotEmail })
                setResetSuccess("OTP sent to your email! Check console for debug OTP.")
                setResetStep(2)
                setTimeout(() => setResetSuccess(""), 3000)
            } catch (err) {
                setResetError(err.message || "Error sending OTP")
            }
        } else if (resetStep === 2) {
            // Verify OTP and move to password step
            setResetStep(3)
            setResetSuccess("Enter your new password")
            setTimeout(() => setResetSuccess(""), 3000)
        } else if (resetStep === 3) {
            // Reset Password
            try {
                const response = await resetPassword({ email: forgotEmail, otp, newPassword })
                setResetSuccess("Password reset successfully! You can now login with your new password.")
                setTimeout(() => {
                    setShowForgotPassword(false)
                    setResetStep(1)
                    setForgotEmail("")
                    setOtp("")
                    setNewPassword("")
                    setResetSuccess("")
                }, 2000)
            } catch (err) {
                setResetError(err.message || "Error resetting password")
            }
        }
        setResetLoading(false)
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                
                {/* Error Alert */}
                {error && (
                    <div className="error-alert">
                        <p>{error}</p>
                        <button type="button" onClick={() => setError("")}>✕</button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address'
                            value={email}
                        />
                    </div>
                    <div className="input-group password-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name='password'
                                placeholder='Enter password'
                                value={password}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className='button primary-button' disabled={loading}>Login</button>
                </form>
                <div className="form-links">
                    <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
                    <button className="forgot-password-btn" onClick={() => setShowForgotPassword(!showForgotPassword)}>
                        Forgot Password?
                    </button>
                </div>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="modal-close" type="button" onClick={() => { setShowForgotPassword(false); setResetStep(1); setResetError(""); setResetSuccess("") }}>✕</button>
                            <h2>Reset Password</h2>

                            {/* Error Alert in Modal */}
                            {resetError && (
                                <div className="error-alert">
                                    <p>{resetError}</p>
                                </div>
                            )}

                            {/* Success Alert in Modal */}
                            {resetSuccess && (
                                <div className="success-alert">
                                    <p>{resetSuccess}</p>
                                </div>
                            )}

                            {resetStep === 1 && (
                                <form onSubmit={handleForgotPasswordClick}>
                                    <div className="input-group">
                                        <label>Enter your email</label>
                                        <input
                                            type="email"
                                            value={forgotEmail}
                                            onChange={(e) => setForgotEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="button primary-button" disabled={resetLoading}>Send OTP</button>
                                </form>
                            )}

                            {resetStep === 2 && (
                                <form onSubmit={handleForgotPasswordClick}>
                                    <div className="input-group">
                                        <label>Enter OTP (6 digits)</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="6-digit OTP"
                                            maxLength="6"
                                            required
                                        />
                                        <small>Check browser console for debug OTP</small>
                                    </div>
                                    <button type="submit" className="button primary-button" disabled={resetLoading}>Verify OTP</button>
                                </form>
                            )}

                            {resetStep === 3 && (
                                <form onSubmit={handleForgotPasswordClick}>
                                    <div className="input-group password-group">
                                        <label>New Password</label>
                                        <div className="password-input-wrapper">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New password (min 6 characters)"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="button primary-button" disabled={resetLoading}>Reset Password</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Login