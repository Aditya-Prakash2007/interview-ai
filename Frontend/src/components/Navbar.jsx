import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './navbar.scss'

const Navbar = () => {
  const { user, handleLogout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [themeMode, setThemeMode] = useState('dark')

  const handleLogoutClick = async () => {
    await handleLogout()
    navigate('/login')
  }

  const toggleTheme = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark'
    setThemeMode(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo/Brand */}
        <div className="navbar__brand">
          <h1 className="navbar__logo">
            <span className="logo-icon">🚀</span>
            InterviewAI
          </h1>
        </div>

        {/* Right Section */}
        <div className="navbar__right">
          {/* Theme Toggle */}
          <button className="navbar__theme-btn" onClick={toggleTheme} title="Toggle theme">
            {themeMode === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="navbar__profile">
            <button 
              className="navbar__profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="profile-name">{user?.username || 'User'}</span>
              <svg 
                className={`profile-chevron ${dropdownOpen ? 'open' : ''}`}
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="navbar__dropdown">
                <div className="dropdown__user-info">
                  <div className="dropdown__avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
                  <div>
                    <p className="dropdown__username">{user?.username}</p>
                    <p className="dropdown__email">{user?.email}</p>
                  </div>
                </div>
                <hr className="dropdown__divider" />
                <button 
                  className="dropdown__logout"
                  onClick={handleLogoutClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
