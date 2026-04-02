import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const [error, setError] = useState(null)


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true }
        } catch (err) {
            const errorMessage = err.message || "Login failed"
            setError(errorMessage)
            console.error("Login error:", err)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        setError(null)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
            return { success: true }
        } catch (err) {
            const errorMessage = err.message || "Registration failed"
            setError(errorMessage)
            console.error("Register error:", err)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await logout()
            setUser(null)
            return { success: true }
        } catch (err) {
            const errorMessage = err.message || "Logout failed"
            setError(errorMessage)
            console.error("Logout error:", err)
            return { success: false, error: errorMessage }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, error, setError, handleRegister, handleLogin, handleLogout }
}