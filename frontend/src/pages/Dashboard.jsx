// pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [passwords, setPasswords] = useState([]);
  const navigate                  = useNavigate();
  const user_id                   = localStorage.getItem("user_id");
  const username                  = localStorage.getItem("username");

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const res = await api.get(`/api/passwords/${user_id}`);
      setPasswords(res.data);
    } catch (err) {
      console.error("Error fetching passwords");
    }
  };

  const handleDelete = async (site) => {
    try {
      await api.delete(`/api/password/${user_id}/${site}`);
      fetchPasswords();
    } catch (err) {
      console.error("Error deleting password");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🔐 SecurePass</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>👤 {username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Generate Button */}
      <div style={styles.generateContainer}>
        <button
          style={styles.generateBtn}
          onClick={() => navigate("/generator")}
        >
          + Generate New Password
        </button>
      </div>

      {/* Password Cards */}
      <div style={styles.grid}>
        {passwords.length === 0 ? (
          <p style={styles.empty}>No passwords saved yet!</p>
        ) : (
          passwords.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3 style={styles.site}>🌐 {item.site}</h3>
              <p style={styles.password}>🔑 {item.password}</p>
              <p style={styles.date}>🕒 {item.updated_at}</p>
              <div style={styles.cardButtons}>
                <button
                  style={styles.historyBtn}
                  onClick={() => navigate(`/history/${item.site}`)}
                >
                  History
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(item.site)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight:       "100vh",
    backgroundColor: "#1a1a2e",
    padding:         "20px",
  },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "24px",
  },
  title: {
    color:    "#e94560",
    fontSize: "24px",
    margin:   0,
  },
  headerRight: {
    display:    "flex",
    alignItems: "center",
    gap:        "16px",
  },
  welcome: {
    color: "#a8a8b3",
  },
  logoutBtn: {
    padding:         "8px 16px",
    backgroundColor: "#0f3460",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    cursor:          "pointer",
  },
  generateContainer: {
    textAlign:    "center",
    marginBottom: "32px",
  },
  generateBtn: {
    padding:         "14px 32px",
    backgroundColor: "#e94560",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "16px",
    cursor:          "pointer",
  },
  grid: {
    display:             "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap:                 "20px",
  },
  card: {
    backgroundColor: "#16213e",
    padding:         "20px",
    borderRadius:    "12px",
    boxShadow:       "0 0 10px rgba(0,0,0,0.3)",
  },
  site: {
    color:        "#e94560",
    marginBottom: "8px",
  },
  password: {
    color:        "#fff",
    fontSize:     "13px",
    marginBottom: "8px",
    wordBreak:    "break-all",
  },
  date: {
    color:        "#a8a8b3",
    fontSize:     "12px",
    marginBottom: "16px",
  },
  cardButtons: {
    display: "flex",
    gap:     "8px",
  },
  historyBtn: {
    flex:            1,
    padding:         "8px",
    backgroundColor: "#0f3460",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    cursor:          "pointer",
  },
  deleteBtn: {
    flex:            1,
    padding:         "8px",
    backgroundColor: "#e94560",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    cursor:          "pointer",
  },
  empty: {
    color:     "#a8a8b3",
    textAlign: "center",
  },
};

export default Dashboard;