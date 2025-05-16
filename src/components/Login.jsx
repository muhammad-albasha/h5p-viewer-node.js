import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MaterializeContainer from "./MaterializeContainer";

export default function Login({ setAuthenticated, isContrast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setAuthenticated(true);
        navigate("/");
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || "Anmeldung fehlgeschlagen.");
      }
    } catch (err) {
      setError("Fehler beim Anmelden. Bitte versuchen Sie es später erneut.");
    }
  };

  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Anmelden</h2>
      </div>
      
      <div className="uni-content">
        <div className="uni-login-container">
          <form className="uni-login-form" onSubmit={handleLogin}>
            <div className="uni-form-group">
              <label htmlFor="email">E-Mail</label>
              <div className="uni-input-container">
                <i className="material-icons">email</i>
                <input
                  type="text"
                  id="email"
                  placeholder="Ihre E-Mail-Adresse"
                  className="uni-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="uni-form-group">
              <label htmlFor="password">Passwort</label>
              <div className="uni-input-container">
                <i className="material-icons">lock</i>
                <input
                  type="password"
                  id="password"
                  placeholder="Ihr Passwort"
                  className="uni-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button type="submit" className="uni-button">
              <i className="material-icons">login</i>
              Anmelden
            </button>
            
            {error && <p className="uni-error-message">{error}</p>}
          </form>
        </div>
      </div>
    </MaterializeContainer>
  );
}
