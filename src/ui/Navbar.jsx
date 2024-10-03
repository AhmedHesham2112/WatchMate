import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
    <nav className="flex justify-between">
      <Link to="/" className="m-3 self-start">
        <div className="">Home</div>
      </Link>
      <div className="self-end">
        <Link to="/topratedmovies" className="m-3">
          TopRated
        </Link>
        <Link to="/popularmovies" className="m-3">
          Popular
        </Link>
        <Link to="/watchlist" className="m-3">
          Watchlist
        </Link>
        <button className="nav-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  ) : (
    <nav className="flex justify-between">
      <Link to="/" className="m-3 self-start">
        <div className="">Home</div>
      </Link>

      <div className="self-end">
        <Link to="/topratedmovies" className="m-3">
          TopRated
        </Link>
        <Link to="/popularmovies" className="m-3">
          Popular
        </Link>
        <Link to="/login" className="m-3">
          Login
        </Link>
        <Link to="/register" className="m-3">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
