// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";
import "./materializeStyles.css";

import PlayH5pGrid from "./components/PlayH5pGrid";
import About from "./components/About";
import Datenschutz from "./components/Datenschutz";
import Contact from "./components/contact";
import MaterializeFacultyMenu from "./components/MaterializeFacultyMenu";
import FacultyDetail from "./components/FacultyDetail";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import LeichteSprache from "./components/LeichteSprache";
import H5PContentPage from "./components/H5PContentPage";
import Impressum from "./components/Impressum";
import MaterializeContainer from "./components/MaterializeContainer";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/Login" />;
};

export default function App() {
  const [isContrast, setIsContrast] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  // Aktualisiere root font-size (rem-basierte Werte)
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Globaler Fetch-Interceptor: Bei 401 wird automatisch ausgeloggt und zur Login-Seite weitergeleitet
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        window.location.href = "/h5p-viewer/Login";
      }
      return response;
    };
  }, []);

  // Erfasse Benutzeraktivität (Mausbewegung, Tastendruck, Klick)
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // Bei aktiver Nutzung den Token regelmäßig verlängern
  useEffect(() => {
    const interval = setInterval(async () => {
      if (Date.now() - lastActivity < 60000) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  const toggleContrast = () => {
    setIsContrast(!isContrast);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div
        className="d-flex flex-column min-vh-100"
        style={{
          overflowX: "hidden",
          padding: "0 5px",
          ...(isContrast && {
            "--primary-color": "#000",
            "--primary-hover": "#000",
          }),
        }}
      >
        {/* Accessibility Toolbar */}
        <div className="accessibility-toolbar">
          {/* Leichte Sprache Button */}
          <Link
            className="accessibility-button"
            to="/leichte-sprache"
          >
            <img
              src="https://assets.uni-wuppertal.de/relaunch-assets/Resources/Public/Icons/iconEasyLanguage.svg"
              alt="Icon for Easy Language"
              width="14"
              height="14"
            />
            <span style={{ fontSize: '0.75rem' }}>Leichte Sprache</span>
          </Link>

          {/* Schriftgröße-Steuerung */}
          <div className="accessibility-button">
            <button
              className="btn btn-link text-dark p-0 mx-1"
              onClick={() => setFontSize((prev) => Math.max(10, prev - 1))}
              aria-label="Reduce font size"
            >
              <i className="material-icons" style={{ fontSize: '14px' }}>remove</i>
            </button>
            <span className="mx-1" style={{ fontSize: '0.75rem' }}>{fontSize}</span>
            <button
              className="btn btn-link text-dark p-0 mx-1"
              onClick={() => setFontSize((prev) => prev + 1)}
              aria-label="Increase font size"
            >
              <i className="material-icons" style={{ fontSize: '14px' }}>add</i>
            </button>
          </div>

          {/* Kontrast Button */}
          <button
            className="accessibility-button"
            onClick={toggleContrast}
            aria-label="Toggle high contrast mode"
          >
            <i className="material-icons" style={{ fontSize: '14px' }}>contrast</i>
            <span style={{ fontSize: '0.75rem' }}>Kontrast</span>
          </button>
        </div>

        {/* University Header */}
        <div className="university-header">
          <div className="uni-container">
            <div className="header-content">
              <div className="university-logo">
                <img
                  src="https://assets.uni-wuppertal.de/relaunch-assets/Resources//Public/Images/logo_header_white.svg"
                  alt="Bergische Universität Wuppertal Logo"
                />
              </div>
              <div className="header-navigation">
                <Link to="/" className="header-nav-button">
                  <i className="material-icons">home</i>
                  <span>Start</span>
                </Link>
                <Link to="/about" className="header-nav-button">
                  <i className="material-icons">info</i>
                  <span>Über Uns</span>
                </Link>
              </div>
              <div className="header-settings">
                <button 
                  className="header-settings-button" 
                  onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                  aria-label="Einstellungen öffnen"
                  aria-haspopup="true"
                  aria-expanded={isSettingsDropdownOpen}
                >
                  <i className="material-icons">settings</i>
                </button>
                {isSettingsDropdownOpen && (
                  <div className="settings-dropdown">
                    {isAuthenticated ? (
                      <>
                        <Link to="/admin" className="settings-dropdown-item" onClick={() => setIsSettingsDropdownOpen(false)}>
                          <i className="material-icons">admin_panel_settings</i>
                          Verwaltung
                        </Link>
                        <button 
                          className="settings-dropdown-item"
                          onClick={() => {
                            handleLogout();
                            setIsSettingsDropdownOpen(false);
                          }}
                        >
                          <i className="material-icons">logout</i>
                          Abmelden
                        </button>
                      </>
                    ) : (
                      <Link to="/Login" className="settings-dropdown-item" onClick={() => setIsSettingsDropdownOpen(false)}>
                        <i className="material-icons">login</i>
                        Anmelden
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Department Header */}
        <div className="department-header">
          <div className="uni-container">
            <h2 className="department-title">H5P-Viewer - Mathematik Lernmaterialien</h2>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="uni-container my-3">
          <ul className="uni-filter-chips">
            {/* This section will be removed as items are moved to the header dropdown */}
          </ul>
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          <div className="mt-4 mx-auto" style={{ width: "100%" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <MaterializeContainer isContrast={isContrast}>
                    <div className="row">
                      <div className="col-md-3">
                        <MaterializeFacultyMenu isContrast={isContrast} />
                      </div>
                      <div className="col-md-9">
                        <PlayH5pGrid isContrast={isContrast} />
                      </div>
                    </div>
                  </MaterializeContainer>
                }
              />
              <Route path="/about" element={<About isContrast={isContrast} />} />
              <Route
                path="/Login"
                element={<Login setAuthenticated={setIsAuthenticated} isContrast={isContrast} />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel isContrast={isContrast} />
                  </ProtectedRoute>
                }
              />
              <Route path="/Datenschutz" element={<Datenschutz isContrast={isContrast} />} />
              <Route path="/Contact" element={<Contact isContrast={isContrast} />} />
              <Route
                path="/:name"
                element={<FacultyDetail isContrast={isContrast} />}
              />
              <Route path="/leichte-sprache" element={<LeichteSprache isContrast={isContrast} />} />
              <Route path="/content" element={<H5PContentPage isContrast={isContrast} />} />
              <Route path="/impressum" element={<Impressum isContrast={isContrast} />} />
            </Routes>
          </div>

          <footer className="uni-footer mt-auto">
            <div className="uni-container">
              <div className="uni-footer-links">
                <Link
                  className="uni-footer-link"
                  to="/Datenschutz"
                >
                  Datenschutz
                </Link>
                <Link
                  className="uni-footer-link"
                  to="/impressum"
                >
                  Impressum
                </Link>
                <Link
                  className="uni-footer-link"
                  to="/Contact"
                >
                  Kontakt
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}
