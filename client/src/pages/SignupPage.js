import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a username");
      return;
    }
    setError(null);

    if (!email) {
      setError("Please enter an email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    fetch("http://127.0.0.1:5000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "User registered successfully") {
          navigate("/login");
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
      });
  };
  return (
    <div>
      <div className="auth-page">
        <div className="auth-card">
          <h1>Signup to Momentum</h1>
          {error && (
            <div className="error-modal">
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
          </form>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
