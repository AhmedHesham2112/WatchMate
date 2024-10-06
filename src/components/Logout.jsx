import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("hellooooooooooooooooooooooooooooooooooooooo")
    localStorage.removeItem("access_token"); // Replace with your token key
    localStorage.removeItem("refresh_token");
    setAuthState({ isAuthenticated: false, token: null });
    console.log(localStorage.getItem("access_token"))
    navigate("/login");
  };

  return (
    <footer>
      <button onClick={handleLogout} className="button">
        Logouttttttttttttttt
      </button>
    </footer>
  );
};

export default Logout;
