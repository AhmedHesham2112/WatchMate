import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmEmail = () => {
  const { token } = useParams(); // Extract token from URL parameters

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/confirm_email_gate/${token}`,
          {
            method: "GET", // or 'POST' if your backend expects it that way
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        if (data.message === "You have confirmed your account. Thank you!") {
          toast.success("You have confirmed your account. Thank you!", {
            position: "top-center",
            className: "custom-toast",
          });
        } else {
          toast.error("Email confirmation failed: " + data.message, {
            position: "top-center",
            className: "custom-toast",
          });
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        toast.error(
          "There was an error confirming your email. Please try again.",
          {
            position: "top-center",
            className: "custom-toast",
          },
        );
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="h-[100vh]">
      <h1>Email Confirmation</h1>
      <p>Confirming your email...</p>
      <ToastContainer />
    </div>
  );
};

export default ConfirmEmail;
