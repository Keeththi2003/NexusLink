import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ui/theme-toggle';
import { Menu, X } from 'lucide-react';

const Navigation = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleMenu = () => setMenuOpen(!isMenuOpen);
  const closeMenu = () => setMenuOpen(false);

  // --- Reusable function to close menu and scroll to top ---
  const handleLinkClick = () => {
    closeMenu();
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    closeMenu();
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary-200 bg-white/80 backdrop-blur-md dark:border-secondary-800 dark:bg-secondary-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center space-x-2" onClick={handleLinkClick}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                NexusLinK
              </span>
            </Link>
          </div>

          {/* Center: Desktop Menu Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/home"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/home')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Home
              </Link>
              <Link
                to="/findus"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/findus')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Find Us
              </Link>
              <Link
                to="/company"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/company')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Company
              </Link>
              <Link
                to="/startup"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/startup')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Startup
              </Link>
              <Link
                to="/talentD"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/talentD')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Job Seeker
              </Link>
              <Link
                to="/contact"
                onClick={handleLinkClick}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive('/contact')
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right: Theme Toggle, Auth, and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-secondary-950 border-t border-secondary-200 dark:border-secondary-800">
          <Link
            to="/home"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/home')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Home
          </Link>
          <Link
            to="/findus"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/findus')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Find Us
          </Link>
          <Link
            to="/company"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/company')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Company
          </Link>
          <Link
            to="/startup"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/startup')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Startup
          </Link>
          <Link
            to="/talentD"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/talentD')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Job Seeker
          </Link>
          <Link
            to="/contact"
            onClick={handleLinkClick}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/contact')
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-300 dark:hover:text-primary-400 dark:hover:bg-primary-900/20'
            }`}
          >
            Contact
          </Link>
          
          {user ? (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transition-colors duration-200"
              onClick={handleLinkClick}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;