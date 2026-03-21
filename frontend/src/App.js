// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Generator from "./pages/Generator";
import History   from "./pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"           element={<Login />}     />
        <Route path="/register"   element={<Register />}  />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/generator"  element={<Generator />} />
        <Route path="/history/:site" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;