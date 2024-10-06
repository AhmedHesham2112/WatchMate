import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import CustomLink from "../ui/Customlink";

const Navbar = () => {
  const { authState, setAuthState } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setAuthState({ isAuthenticated: false, token: null, email: null });
    navigate("/");
  };

  // Define the active class for the red underline
  const isActive = (path) => location.pathname === path;
  //
  return (
    <nav className="flex items-center justify-between bg-gradient-to-r from-black via-red-950 to-black px-8 py-4 text-white shadow-lg">
      <Link to="/" className="m-3 self-start">
        <div>Home</div>
      </Link>

      <div className="m-3 flex space-x-5 self-end">
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
              className="nav-button underline-none text-white"
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
