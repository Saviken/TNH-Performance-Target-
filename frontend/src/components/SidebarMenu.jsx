import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FiLayers } from "react-icons/fi";

const SidebarMenu = () => {
  const [branches, setBranches] = useState([]);
  const location = useLocation();

  useEffect(() => {
    axios.get("http://localhost:8000/api/branches/")
      .then(res => setBranches(res.data));
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <aside style={{ width: 260, background: "#fff", minHeight: "100vh", padding: "2em 1em" }}>
      <div style={{ marginBottom: "2em" }}>
        <img src="/logo-tnh.png" alt="The Nairobi Hospital" style={{ width: 80, marginBottom: 8 }} />
        <div style={{ fontWeight: "bold", color: "#8B1C13", fontSize: 18, marginBottom: 24 }}>
          THE NAIROBI HOSPITAL
        </div>
      </div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: 13, color: "#888", marginBottom: 8 }}>TNH PERFORMANCE TARGETS</div>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
          <li>
            <Link to="/dashboard" style={{
              display: "flex",
              alignItems: "center",
              color: isActive("/dashboard") ? "#fff" : "#222",
              background: isActive("/dashboard") ? "#8B1C13" : "transparent",
              borderRadius: 8,
              padding: "0.5em"
            }}>
              <FiLayers style={{ marginRight: 8 }} />
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <div style={{ fontWeight: "bold", fontSize: 13, color: "#888", marginBottom: 8 }}>BRANCHES</div>
        <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
          {branches.map(branch => (
            <li key={branch.id}>
              <Link
                to={`/branch/${branch.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: isActive(`/branch/${branch.id}`) ? "#fff" : "#222",
                  background: isActive(`/branch/${branch.id}`) ? "#8B1C13" : "transparent",
                  borderRadius: 8,
                  padding: "0.5em"
                }}
              >
                <FiLayers style={{ marginRight: 8 }} />
                {branch.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarMenu;
