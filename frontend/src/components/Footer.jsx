import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 dark:bg-black text-white" id="footer-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                NexusLinK
              </span>
            </div>
            <p className="text-secondary-300 mb-6 max-w-md leading-relaxed">
              Connecting ambition with opportunity. We bridge the gap between emerging talent and innovative companies, creating pathways to success in the tech industry.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                <FaGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors duration-200">
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/findus" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Find Us
                </Link>
              </li>
              <li>
                <Link to="/company" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Company
                </Link>
              </li>
              <li>
                <Link to="/startup" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Startup
                </Link>
              </li>
              <li>
                <Link to="/talentD" className="text-secondary-300 hover:text-primary-400 transition-colors duration-200">
                  Job Seeker
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-primary-400 h-4 w-4" />
                <span className="text-secondary-300">123 Tech Street, Silicon Valley, CA</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 h-4 w-4" />
                <span className="text-secondary-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 h-4 w-4" />
                <span className="text-secondary-300">info@nexuslink.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2024 NexusLinK. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;