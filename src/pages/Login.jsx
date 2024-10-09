import React, { useState, useContext, useEffect } from "react";
import { loginUser } from "../services/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/popularmovies");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState({ value: "", isTouched: false });

  const { setAuthState } = useContext(AuthContext);

  const clearForm = () => {
    setEmail("");
    setPassword({ value: "", isTouched: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password: password.value };
    console.log(userData)
    const response = await loginUser(userData);

    if (response.message === "Login successful") {
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      toast.success("Logged in successfully!", {
        position: "top-center",
        className: "custom-toast",
      });
      clearForm();

      setAuthState({
        isAuthenticated: true,
        token: response.token,
        email: email,
      });

      navigate("/");
    } else {
      toast.error("Error logging in! Please try again.", {
        position: "top-center",
        className: "custom-toast",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-black bg-opacity-50 p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold">Login</h2>

        <div className="space-y-4">
          <InputField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@example.com"
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password.value}
            onChange={(e) =>
              setPassword({ ...password, value: e.target.value })
            }
            placeholder="••••••••"
            required
          />
        </div>
        <div className="mt-5 flex justify-center">
          <Button type="primary" className="mt-6 w-full">
            Login
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
