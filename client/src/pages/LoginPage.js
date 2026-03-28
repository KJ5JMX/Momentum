import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter your username");
      return;
    }
    setError(null);

    if (!password) {
      setError("Please enter your password");
      return;
    }

    fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          navigate("/dashboard");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      <h1>Login to Momentum</h1>
      {error && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "20px 30px",
            borderRadius: "10px",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <p>{error}</p>
          <button onClick={() => setError("")}>OK</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
