// pages/Register.jsx

import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/api/register", {
        username:        username,
        master_password: password,
      });
      setMessage("Account created! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("Username already exists!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>🔐 SecurePass</h1>
        <p style={styles.subtitle}>Create your account</p>

        <input
          style={styles.input}
          type="text"
          placeholder="Choose Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Choose Master Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error   && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        <p style={styles.link}>
          Already have account?{" "}
          <span style={styles.linkText} onClick={() => navigate("/")}>
            Login here
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
  success: {
    color:        "#4caf50",
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

export default Register;