import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Admin from "./pages/Admin";
import TrackOrder from "./pages/TrackOrder";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track-order" element={<TrackOrder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);