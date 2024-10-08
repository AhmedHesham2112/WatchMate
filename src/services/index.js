const API_URL = "http://localhost:9000";

const getAccessToken = () => {
  return localStorage.getItem("access_token"); // Replace with your access token storage method
};

const getRefreshToken = () => {
  return localStorage.getItem("refresh_token"); // Replace with your refresh token storage method
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const response = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }), // Send refresh token to refresh endpoint
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken); // Update access token
    return data.accessToken; // Return the new access token
  } else {
    // Handle the error, possibly logging out the user if the refresh fails
    console.error("Failed to refresh token.");
    return null;
  }
};

const request = async (url, method, body = null) => {
  const headers = { "Content-Type": "application/json" };
  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${url}`, options);
  return response.json();
};


const protectedRequest = async (url, method, body = null) => {
  let token = getAccessToken();

  // Include Authorization header with Bearer token
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}` // Attach JWT token
  };

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  let response = await fetch(`${API_URL}${url}`, options);

  // Handle token expiration or invalid token
  if (response.status === 401) {
    token = await refreshAccessToken(); // Attempt to refresh the token
    if (token) {
      // Retry the original request with the new access token
      response = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the new access token
        },
        body: body ? JSON.stringify(body) : null,
      });
    }
  }

  return response.json();
};

export default request; // Default export
export { protectedRequest };