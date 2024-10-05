import React, { useContext } from "react";
import RegisterContext from "../contexts/RegisterContext";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

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

  const navigate = useNavigate();

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

    // Validate email, password, and confirm password
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = password === confirmPassword;

    if (!isEmailValid) {
      dispatch({ type: "SET_EMAIL_ERROR", payload: true });
      return;
    }

    if (!isPasswordValid) {
      dispatch({ type: "SET_PASSWORD_ERROR", payload: true });
      return;
    }

    if (!isConfirmPasswordValid) {
      dispatch({ type: "SET_CONFIRM_PASSWORD_ERROR", payload: true });
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
      alert("Account created!");
      clearForm();
      navigate("/login"); // Redirect to login after success
    } else if (response.message === "User with this Email already exists") {
      alert(response.message);
    } else {
      alert("Error creating account");
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center rounded-lg border border-gray-400 px-5 py-10"
      >
        <fieldset className="flex flex-col gap-5">
          <h2 className="mb-5 text-center text-2xl font-bold">Sign Up</h2>
          <div className="flex justify-between">
            <label>
              First name <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={firstName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "firstName",
                  payload: e.target.value,
                })
              }
              placeholder="First name"
              required
            />
          </div>
          <div className="flex justify-between">
            <label>
              Last name <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={lastName}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "lastName",
                  payload: e.target.value,
                })
              }
              placeholder="Last name"
              required
            />
          </div>
          <div className="flex justify-between">
            <label>
              Email address <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={email}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "email",
                  payload: e.target.value,
                })
              }
              placeholder="Email address"
              required
            />
          </div>
          {emailError && <EmailErrorMessage />}
          <div className="flex justify-between">
            <label>
              Password <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={password}
              type="password"
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "password",
                  payload: e.target.value,
                })
              }
              placeholder="Password"
              required
            />
          </div>
          {passwordError && <PasswordErrorMessage />}
          <div className="flex justify-between">
            <label>
              Confirm Password <sup>*</sup>
            </label>
            <input
              className="input ml-3 border-2 text-black"
              value={confirmPassword}
              type="password"
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "confirmPassword",
                  payload: e.target.value,
                })
              }
              placeholder="Confirm Password"
              required
            />
          </div>
          {confirmPasswordError && <ConfirmPasswordErrorMessage />}

          <Button type="primary">Create account</Button>
        </fieldset>
      </form>
    </div>
  );
}

export default Register;

const PasswordErrorMessage = () => (
  <p className="FieldError">
    Password should have at least 8 characters and include uppercase, lowercase,
    number, and special character
  </p>
);

const EmailErrorMessage = () => (
  <p className="FieldError">Invalid email address</p>
);

const ConfirmPasswordErrorMessage = () => (
  <p className="FieldError">Passwords do not match</p>
);
