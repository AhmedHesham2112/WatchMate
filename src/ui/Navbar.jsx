import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./style/Navbar.css";
import logo from "./style/Pics/logo.png";

const Navbar = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const getButtonClass = (path) => {
    return location.pathname === path ? "nav-button active" : "nav-button";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setAuthState({ isAuthenticated: false, token: null, email: null });
    navigate("/");
  };
  return authState.isAuthenticated ? (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-links">
        <Link to="/dashboard" className={getButtonClass("/dashboard")}>
          Dashboard
        </Link>
        <Link
          to="/create-auction"
          className={getButtonClass("/create-auction")}
        >
          Create Auction
        </Link>
        <Link to="/auctions-page" className={getButtonClass("/auctions-page")}>
          Auctions
        </Link>
        <Link to="/about" className={getButtonClass("/about")}>
          About
        </Link>
        <button className="nav-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  ) : (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-links">
        <Link to="/login" className={getButtonClass("/login")}>
          Login
        </Link>
        <Link to="/register" className={getButtonClass("/register")}>
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
