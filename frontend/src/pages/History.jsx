// pages/History.jsx

import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

function History() {
  const [history, setHistory] = useState([]);
  const { site }              = useParams();
  const navigate              = useNavigate();
  const user_id               = localStorage.getItem("user_id");

  useEffect(() => {
    fetchHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/api/history/${user_id}/${site}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>🕒 Password History</h2>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
        </div>

        <p style={styles.site}>Site: <span style={styles.siteName}>{site}</span></p>

        {/* History List */}
        {history.length === 0 ? (
          <p style={styles.empty}>No history found!</p>
        ) : (
          <div style={styles.timeline}>
            {history.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.dot} />
                <div style={styles.cardContent}>
                  <p style={styles.password}>{item.password}</p>
                  <p style={styles.date}>🕒 {item.generated_at}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight:       "100vh",
    backgroundColor: "#1a1a2e",
    display:         "flex",
    justifyContent:  "center",
    padding:         "40px 20px",
  },
  box: {
    backgroundColor: "#16213e",
    padding:         "32px",
    borderRadius:    "12px",
    width:           "480px",
    height:          "fit-content",
    boxShadow:       "0 0 20px rgba(0,0,0,0.5)",
  },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "16px",
  },
  title: {
    color:  "#e94560",
    margin: 0,
  },
  backBtn: {
    padding:         "8px 16px",
    backgroundColor: "#0f3460",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    cursor:          "pointer",
  },
  site: {
    color:        "#a8a8b3",
    marginBottom: "24px",
  },
  siteName: {
    color:      "#e94560",
    fontWeight: "bold",
  },
  timeline: {
    display:       "flex",
    flexDirection: "column",
    gap:           "16px",
  },
  card: {
    display:    "flex",
    alignItems: "flex-start",
    gap:        "12px",
  },
  dot: {
    width:           "12px",
    height:          "12px",
    borderRadius:    "50%",
    backgroundColor: "#e94560",
    marginTop:       "4px",
    flexShrink:      0,
  },
  cardContent: {
    backgroundColor: "#0f3460",
    padding:         "12px 16px",
    borderRadius:    "8px",
    flex:            1,
  },
  password: {
    color:      "#fff",
    fontFamily: "monospace",
    fontSize:   "14px",
    wordBreak:  "break-all",
    margin:     "0 0 8px 0",
  },
  date: {
    color:    "#a8a8b3",
    fontSize: "12px",
    margin:   0,
  },
  empty: {
    color:     "#a8a8b3",
    textAlign: "center",
  },
};

export default History;