import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Admin from "./pages/Admin";
import TrackOrder from "./pages/TrackOrder";

const MAINTENANCE_MODE = true;

function Maintenance() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🚧 Under Maintenance</h1>
      <p>We are currently improving the system. Please check back later.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {MAINTENANCE_MODE ? (
        <Maintenance />
      ) : (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/track-order" element={<TrackOrder />} />
        </Routes>
      )}
    </BrowserRouter>
  </React.StrictMode>
);