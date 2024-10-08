import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import CustomLink from "../ui/Customlink";
import { FaBars, FaTimes } from "react-icons/fa"; // Hamburger and Close icons

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
    <nav className="flex items-center justify-between bg-gradient-to-r from-black via-red-950 to-black px-8 py-4 text-white shadow-lg">
      <Link to="/" className="m-3 self-start text-xl font-bold">
        <div>Home</div>
      </Link>

      {/* Hamburger Button for small screens */}
      <button className="block text-2xl md:hidden" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}{" "}
        {/* Toggle between hamburger and close icons */}
      </button>

      {/* Navbar links (initially hidden on small screens, visible on md+) */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } m-3 mt-5 w-full text-center md:mt-0 md:flex md:w-auto md:space-x-5 md:self-end md:text-left`}
      >
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
