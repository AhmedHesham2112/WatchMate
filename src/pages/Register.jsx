import React, { useContext } from "react";
import RegisterContext from "../contexts/RegisterContext";
import { registerUser } from "../services/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

function Register() {
  const { state, dispatch } = useContext(RegisterContext);
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
  } = state;

  const clearForm = () => {
    dispatch({ type: "CLEAR_FORM" });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_EMAIL_ERROR", payload: false });
    dispatch({ type: "SET_PASSWORD_ERROR", payload: false });
    dispatch({ type: "SET_CONFIRM_PASSWORD_ERROR", payload: false });

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = password === confirmPassword;

    if (!isEmailValid) {
      dispatch({ type: "SET_EMAIL_ERROR", payload: true });
      toast.error("Please enter a valid email address.", {
        position: "top-center",
        className: "custom-toast",
      });
      return;
    }

    if (!isPasswordValid) {
      dispatch({ type: "SET_PASSWORD_ERROR", payload: true });
      toast.error(
        "Password must contain at least 8 characters, including upper, lower, number, and special character.",
        {
          position: "top-center",
          className: "custom-toast",
        },
      );
      return;
    }

    if (!isConfirmPasswordValid) {
      dispatch({ type: "SET_CONFIRM_PASSWORD_ERROR", payload: true });
      toast.error("Passwords do not match.", {
        position: "top-center",
        className: "custom-toast",
      });
      return;
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    const response = await registerUser(userData);
    if (response.message === "User registered successfully") {
      toast.success(
        "Registered successfully please check your mail to verify your account!",
        {
          position: "top-center",
          className: "custom-toast",
        },
      );
      clearForm();
    } else if (response.message === "User with this Email already exists") {
      toast.error(response.message, {
        position: "top-center",
        className: "custom-toast",
      });
    } else {
      toast.error("Error creating account", {
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
        <h2 className="mb-6 text-center text-3xl font-semibold">
          Create an Account
        </h2>

        <div className="space-y-4">
          <InputField
            label="First Name"
            value={firstName}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "firstName",
                payload: e.target.value,
              })
            }
            placeholder="John"
            required
          />
          <InputField
            label="Last Name"
            value={lastName}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "lastName",
                payload: e.target.value,
              })
            }
            placeholder="Doe"
            required
          />
          <InputField
            label="Email Address"
            value={email}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "email",
                payload: e.target.value,
              })
            }
            placeholder="johndoe@example.com"
            error={emailError && "Please enter a valid email address."}
            required
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "password",
                payload: e.target.value,
              })
            }
            placeholder="••••••••"
            error={passwordError && "Password must be strong."}
            required
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "SET_FIELD",
                field: "confirmPassword",
                payload: e.target.value,
              })
            }
            placeholder="••••••••"
            error={confirmPasswordError && "Passwords do not match."}
            required
          />
        </div>

        <div className="mt-5 flex justify-center">
          <Button type="primary" className="mt-6 w-full">
            Sign Up
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Register;
