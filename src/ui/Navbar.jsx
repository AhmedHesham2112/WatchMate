import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import CustomLink from "../ui/Customlink";
import { FaBars, FaTimes } from "react-icons/fa";
import logo_large from "../assets/logo_large.png";
import logo_mini from "../assets/logo_mini.png";

const Navbar = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu visibility

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setAuthState({ isAuthenticated: false, token: null });
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="relative z-20 flex items-center justify-between bg-gradient-to-r from-black via-red-950 to-black px-8 py-4 text-white shadow-lg">
      <Link to="/" className="self-start text-xl font-bold">
        <img
          src={logo_large}
          alt="WatchMate"
          className="w-30 hidden h-16 md:block"
        />
        <img
          src={logo_mini}
          alt="WatchMate"
          className="block h-16 w-14 md:hidden"
        />
      </Link>

      {/* Hamburger Button for small screens */}
      <button className="block text-2xl md:hidden" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}{" "}
        {/* Toggle between hamburger and close icons */}
      </button>

      {/* Dropdown menu (hidden initially on small screens) */}
      {menuOpen && (
        <div
          className="absolute right-0 top-20 z-10 w-full bg-gradient-to-r from-black via-red-950 to-black px-8 py-4 text-center md:hidden"
          onClick={toggleMenu} // Close dropdown when clicked
        >
          <div className="flex flex-col space-y-4 py-2">
            {authState.isAuthenticated ? (
              <>
                <CustomLink
                  to="/topratedmovies"
                  currentPath={location.pathname}
                >
                  TopRated
                </CustomLink>
                <CustomLink to="/popularmovies" currentPath={location.pathname}>
                  Popular
                </CustomLink>
                <CustomLink to="/watchlist" currentPath={location.pathname}>
                  Watchlist
                </CustomLink>
                <CustomLink to="/favorites" currentPath={location.pathname}>
                  Favorites
                </CustomLink>
                <button
                  className="nav-button underline-none mt-4 text-white hover:text-red-logo md:mt-0"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <CustomLink
                  to="/topratedmovies"
                  currentPath={location.pathname}
                >
                  TopRated
                </CustomLink>
                <CustomLink to="/popularmovies" currentPath={location.pathname}>
                  Popular
                </CustomLink>
                <CustomLink to="/login" currentPath={location.pathname}>
                  Login
                </CustomLink>
                <CustomLink to="/register" currentPath={location.pathname}>
                  Register
                </CustomLink>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navbar links (visible on medium screens and larger) */}
      <div className="hidden md:flex md:space-x-5">
        {authState.isAuthenticated ? (
          <>
            <CustomLink to="/topratedmovies" currentPath={location.pathname}>
              TopRated
            </CustomLink>
            <CustomLink to="/popularmovies" currentPath={location.pathname}>
              Popular
            </CustomLink>
            <CustomLink to="/watchlist" currentPath={location.pathname}>
              Watchlist
            </CustomLink>
            <CustomLink to="/favorites" currentPath={location.pathname}>
              Favorites
            </CustomLink>
            <button
              className="nav-button underline-none mt-4 text-white hover:text-red-logo md:mt-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <CustomLink to="/topratedmovies" currentPath={location.pathname}>
              TopRated
            </CustomLink>
            <CustomLink to="/popularmovies" currentPath={location.pathname}>
              Popular
            </CustomLink>
            <CustomLink to="/login" currentPath={location.pathname}>
              Login
            </CustomLink>
            <CustomLink to="/register" currentPath={location.pathname}>
              Register
            </CustomLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
