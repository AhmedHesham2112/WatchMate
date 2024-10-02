import { createContext, useReducer } from "react";

const RegisterContext = createContext();

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  emailError: false,
  passwordError: false,
  confirmPasswordError: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.payload };

    case "SET_EMAIL_ERROR":
      return { ...state, emailError: action.payload };

    case "SET_PASSWORD_ERROR":
      return { ...state, passwordError: action.payload };

    case "SET_CONFIRM_PASSWORD_ERROR":
      return { ...state, confirmPasswordError: action.payload };

    case "CLEAR_FORM":
      return initialState;

    default:
      return state;
  }
}

export function RegisterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <RegisterContext.Provider value={{ state, dispatch }}>
      {children}
    </RegisterContext.Provider>
  );
}

export default RegisterContext;
