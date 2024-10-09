import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const ConfirmEmail = () => {
  const { token } = useParams(); // Extract token from URL parameters

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/confirm_email/${token}`,
          {
            method: "GET", // or 'POST' if your backend expects it that way
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        if (data.message === 'You have confirmed your account. Thank you!') {
          alert("Email confirmed successfully!");
          // Optionally redirect the user or perform additional actions
        } else {
          alert("Email confirmation failed: " + data.message);
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        alert("There was an error confirming your email. Please try again.");
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Confirmation</h1>
      <p>Confirming your email...</p>
    </div>
  );
};

export default ConfirmEmail;
