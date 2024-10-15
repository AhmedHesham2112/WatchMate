import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import logo_large from "../assets/logo_large.png";
import logo_mini from "../assets/logo_mini.png";
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-red-950 to-black py-6 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        {/* Logo Section */}
        <div className="mb-4 md:mb-0">
          <img src={logo_large} alt="WatchMate" className="w-30 h-16" />
        </div>

        {/* Slogan section */}
        <div className="flex flex-col md:flex-row">
          <p className="text-lg font-light">
            Your Companion For The Best Movies
          </p>
        </div>

        {/* Social Media Section */}
        <div className="mt-4 flex space-x-4 md:mt-0">
          <a href="https://www.facebook.com" className="hover:text-red-logo">
            <FaFacebook size={24} />
          </a>
          <a href="https://www.twitter.com" className="hover:text-red-logo">
            <FaTwitter size={24} />
          </a>
          <a href="https://www.instagram.com" className="hover:text-red-logo">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.linkedin.com" className="hover:text-red-logo">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center">
        <p className="text-sm">© 2024 WatchMate. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
