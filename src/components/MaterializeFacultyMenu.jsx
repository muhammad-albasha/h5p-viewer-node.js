// MaterializeFacultyMenu.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "../materializeStyles.css";

/**
 * Faculty menu component following the Bergische Universität Wuppertal theme
 */
const MaterializeFacultyMenu = ({ isContrast }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/faculties`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Alphabetisch sortieren nach dem Namen
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setFaculties(sortedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculties();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-3 my-4">
        Error loading faculties: {error}
      </Alert>
    );
  }
  return (
    <div className={`uni-sidemenu ${isContrast ? "contrast-mode" : ""}`}>
      <div className="uni-sidemenu-header">
        <h3 className="uni-sidemenu-title">
          <i className="material-icons">category</i>
          Themen
        </h3>
      </div>
      <ul className="uni-sidemenu-items">
        <li className={`uni-sidemenu-item ${window.location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="uni-sidemenu-link">
            <i className="material-icons">view_list</i>
            Alle Inhalte
          </Link>
        </li>
        {faculties.map((faculty) => (
          <li 
            key={faculty.id} 
            className={`uni-sidemenu-item ${window.location.pathname === `/${encodeURIComponent(faculty.name)}` ? 'active' : ''}`}
          >
            <Link 
              to={`/${encodeURIComponent(faculty.name)}`} 
              className="uni-sidemenu-link"
            >
              <i className="material-icons">folder</i>
              {faculty.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

MaterializeFacultyMenu.propTypes = {
  isContrast: PropTypes.bool,
};

export default MaterializeFacultyMenu;
