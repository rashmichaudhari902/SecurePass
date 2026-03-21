// pages/Generator.jsx

import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Generator() {
  const [password, setPassword] = useState("");
  const [site, setSite]         = useState("");
  const [message, setMessage]   = useState("");
  const [strength, setStrength] = useState(null);
  const [rules, setRules]       = useState({
    min_length:    12,
    max_length:    32,
    use_uppercase: true,
    use_lowercase: true,
    use_digits:    true,
    use_symbols:   true,
  });

  const navigate = useNavigate();
  const user_id  = localStorage.getItem("user_id");

  const handleGenerate = async () => {
    try {
      const res = await api.post("/api/generate", {
        user_id: parseInt(user_id),
        rules:   rules,
      });
      setPassword(res.data.password);
      setStrength(res.data.strength);
      setMessage("");
    } catch (err) {
      setMessage("Error generating password!");
    }
  };

  const handleUndo = async () => {
    try {
      const res = await api.post("/api/undo", {
        user_id: parseInt(user_id),
      });
      setPassword(res.data.password);
      setStrength(res.data.strength);
    } catch (err) {
      setMessage("Nothing to undo!");
    }
  };

  const handleSave = async () => {
    if (!site || !password) {
      setMessage("Enter site name first!");
      return;
    }
    try {
      await api.post("/api/save", {
        user_id:  parseInt(user_id),
        site:     site,
        password: password,
      });
      setMessage("Password saved successfully!");
    } catch (err) {
      setMessage("Error saving password!");
    }
  };

  const getStrengthColor = () => {
    if (!strength) return "#a8a8b3";
    if (strength.label === "Strong") return "#4caf50";
    if (strength.label === "Medium") return "#ff9800";
    return "#e94560";
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>

        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>⚙️ Password Generator</h2>
          <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
        </div>

        {/* Site Input */}
        <input
          style={styles.input}
          type="text"
          placeholder="Enter site name (e.g. gmail.com)"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />

        {/* Rules */}
        <div style={styles.rulesBox}>
          <h3 style={styles.rulesTitle}>Rules</h3>

          <div style={styles.lengthRow}>
            <label style={styles.label}>Min Length: {rules.min_length}</label>
            <input
              type="range" min="6" max="32"
              value={rules.min_length}
              onChange={(e) => setRules({ ...rules, min_length: parseInt(e.target.value) })}
            />
          </div>

          <div style={styles.lengthRow}>
            <label style={styles.label}>Max Length: {rules.max_length}</label>
            <input
              type="range" min="6" max="64"
              value={rules.max_length}
              onChange={(e) => setRules({ ...rules, max_length: parseInt(e.target.value) })}
            />
          </div>

          <div style={styles.checkboxRow}>
            <label style={styles.label}>
              <input type="checkbox" checked={rules.use_uppercase}
                onChange={(e) => setRules({ ...rules, use_uppercase: e.target.checked })} />
              {" "} Uppercase (A-Z)
            </label>
            <label style={styles.label}>
              <input type="checkbox" checked={rules.use_lowercase}
                onChange={(e) => setRules({ ...rules, use_lowercase: e.target.checked })} />
              {" "} Lowercase (a-z)
            </label>
            <label style={styles.label}>
              <input type="checkbox" checked={rules.use_digits}
                onChange={(e) => setRules({ ...rules, use_digits: e.target.checked })} />
              {" "} Digits (0-9)
            </label>
            <label style={styles.label}>
              <input type="checkbox" checked={rules.use_symbols}
                onChange={(e) => setRules({ ...rules, use_symbols: e.target.checked })} />
              {" "} Symbols (!@#$)
            </label>
          </div>
        </div>

        {/* Generated Password */}
        {password && (
          <div style={styles.passwordBox}>
            <p style={styles.generatedPassword}>{password}</p>
            {strength && (
              <div style={styles.strengthBox}>
                <span style={{ color: getStrengthColor(), fontWeight: "bold" }}>
                  {strength.label}
                </span>
                <div style={styles.strengthBar}>
                  <div style={{
                    ...styles.strengthFill,
                    width:           `${(strength.score / 3) * 100}%`,
                    backgroundColor: getStrengthColor(),
                  }} />
                </div>
              </div>
            )}
          </div>
        )}

        {message && <p style={styles.message}>{message}</p>}

        {/* Buttons */}
        <div style={styles.buttons}>
          <button style={styles.generateBtn} onClick={handleGenerate}>
            Generate
          </button>
          <button style={styles.undoBtn} onClick={handleUndo}>
            ↩ Undo
          </button>
          <button style={styles.saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>

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
    alignItems:      "center",
    padding:         "20px",
  },
  box: {
    backgroundColor: "#16213e",
    padding:         "32px",
    borderRadius:    "12px",
    width:           "480px",
    boxShadow:       "0 0 20px rgba(0,0,0,0.5)",
  },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "24px",
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
  rulesBox: {
    backgroundColor: "#0f3460",
    padding:         "16px",
    borderRadius:    "8px",
    marginBottom:    "16px",
  },
  rulesTitle: {
    color:        "#a8a8b3",
    margin:       "0 0 12px 0",
    fontSize:     "14px",
  },
  lengthRow: {
    marginBottom: "12px",
  },
  checkboxRow: {
    display:       "flex",
    flexDirection: "column",
    gap:           "8px",
  },
  label: {
    color:    "#fff",
    fontSize: "14px",
  },
  passwordBox: {
    backgroundColor: "#0f3460",
    padding:         "16px",
    borderRadius:    "8px",
    marginBottom:    "16px",
    textAlign:       "center",
  },
  generatedPassword: {
    color:      "#fff",
    fontSize:   "18px",
    fontFamily: "monospace",
    wordBreak:  "break-all",
    margin:     "0 0 12px 0",
  },
  strengthBox: {
    textAlign: "center",
  },
  strengthBar: {
    backgroundColor: "#1a1a2e",
    borderRadius:    "4px",
    height:          "8px",
    marginTop:       "8px",
  },
  strengthFill: {
    height:       "8px",
    borderRadius: "4px",
    transition:   "width 0.3s ease",
  },
  message: {
    color:        "#4caf50",
    textAlign:    "center",
    marginBottom: "12px",
  },
  buttons: {
    display: "flex",
    gap:     "8px",
  },
  generateBtn: {
    flex:            2,
    padding:         "12px",
    backgroundColor: "#e94560",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "14px",
    cursor:          "pointer",
  },
  undoBtn: {
    flex:            1,
    padding:         "12px",
    backgroundColor: "#0f3460",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "14px",
    cursor:          "pointer",
  },
  saveBtn: {
    flex:            1,
    padding:         "12px",
    backgroundColor: "#4caf50",
    color:           "#fff",
    border:          "none",
    borderRadius:    "8px",
    fontSize:        "14px",
    cursor:          "pointer",
  },
};

export default Generator;