import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setAuthState({ isAuthenticated: false, token: null, email: null });
    navigate("/login");
  };

  return (
    <footer>
      <button onClick={handleLogout} className="button">
        Logout
      </button>
    </footer>
  );
};

export default Logout;
