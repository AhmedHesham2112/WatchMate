import React, { useState, useContext } from "react";
import { loginUser } from "../services/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({ value: "", isTouched: false });

  const { setAuthState } = useContext(AuthContext); // Access AuthContext
  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPassword({ value: "", isTouched: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password: password.value };
    const response = await loginUser(userData);

    if (response.message === "Login successful") {
      // Store authentication info in localStorage and context
      alert("Logged in successfully!");

      clearForm();
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userEmail", email);

      setAuthState({
        isAuthenticated: true,
        token: response.token,
        email: email,
      });

      // Redirect to dashboard
      navigate("/watchlist");
    } else {
      alert("Error logging in! Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-col gap-5">
          <h2>Login</h2>
          <div>
            <label>
              Email address <sup>*</sup>
            </label>
            <input
              className="ml-3 border-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <div>
            <label>
              Password <sup>*</sup>
            </label>
            <input
              className="ml-3 border-2"
              value={password.value}
              type="password"
              onChange={(e) =>
                setPassword({ ...password, value: e.target.value })
              }
              onBlur={() => setPassword({ ...password, isTouched: true })}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="border-4">
            Login
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
