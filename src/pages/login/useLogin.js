const API = import.meta.env.VITE_API_URL;

export async function validateLogin(username, password) {
  try {
    const response = await fetch(`${API}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data["message"] === "Login successful") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
}
