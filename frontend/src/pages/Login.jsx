// pages/Login.jsx

import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login", {
        username:        username,
        master_password: password,
      });
      localStorage.setItem("user_id",  res.data.user_id);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>🔐 SecurePass</h1>
        <p style={styles.subtitle}>Your Personal Password Manager</p>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.link}>
          No account?{" "}
          <span style={styles.linkText} onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display:         "flex",
    justifyContent:  "center",
    alignItems:      "center",
    height:          "100vh",
    backgroundColor: "#1a1a2e",
  },
  box: {
    backgroundColor: "#16213e",
    padding:         "40px",
    borderRadius:    "12px",
    width:           "360px",
    textAlign:       "center",
    boxShadow:       "0 0 20px rgba(0,0,0,0.5)",
  },
  title: {
    color:        "#e94560",
    fontSize:     "28px",
    marginBottom: "8px",
  },
  subtitle: {
    color:        "#a8a8b3",
    marginBottom: "24px",
  },
  input: {
    width:           "100%",
    padding:         "12px",
    marginBottom:    "16px",
    borderRadius:    "8px",
    border:          "1px solid #0f3460",
    backgroundColor: "#0f3460",
    color:           "#fff",
    fontSize:        "14px",
    boxSizing:       "border-box",
  },
  button: {
    width:           "100%",
    padding:         "12px",
    backgroundColor: "#e94560",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "16px",
    cursor:          "pointer",
    marginBottom:    "16px",
  },
  error: {
    color:        "#e94560",
    marginBottom: "12px",
  },
  link: {
    color: "#a8a8b3",
  },
  linkText: {
    color:  "#e94560",
    cursor: "pointer",
  },
};

export default Login;