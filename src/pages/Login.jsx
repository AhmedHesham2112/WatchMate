import React, { useState, useContext, useEffect } from "react";
import { loginUser } from "../services/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Replace with your token key
    if (token) {
      navigate('/popularmovies'); // Redirect to the dashboard or home
    }
  }, [navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({ value: "", isTouched: false });

  const { setAuthState } = useContext(AuthContext); // Access AuthContext


  const clearForm = () => {
    setEmail("");
    setPassword({ value: "", isTouched: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password: password.value };
    const response = await loginUser(userData);

    if (response.message === "Login successful") {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      // Store authentication info in localStorage and context
      alert("Logged in successfully!");

      clearForm();


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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center rounded-lg border border-gray-400 px-5 py-10"
      >
        <fieldset className="flex flex-col gap-5">
          <h2 className="mb-5 text-center text-2xl font-bold">Login</h2>
          <div className="flex justify-between">
            <label>
              Email address <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>
          <div className="flex justify-between">
            <label>
              Password <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
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
          <Button type="primary">Login</Button>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
