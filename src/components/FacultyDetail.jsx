import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PlayH5p from "./PlayH5p";
import Popup from "./Popup";
import MaterializeFacultyMenu from "./MaterializeFacultyMenu";

const FacultyDetail = ({ isContrast }) => {
  const { name } = useParams();
  const [h5pData, setH5pData] = useState([]);  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchInputRef = useRef(null);

  // Daten für die Fakultät und zugehörige H5P-Inhalte laden
  useEffect(() => {
    const fetchH5PDataForFaculty = async () => {
      try {
        const facultyResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/faculties`
        );
        const faculties = await facultyResponse.json();
        // Fakultäten alphabetisch sortieren
        const sortedFaculties = faculties.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const matchedFaculty = sortedFaculties.find(
          (f) => f.name === decodeURIComponent(name)
        );

        if (matchedFaculty) {
          const h5pResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/h5pContent?facultyId=${matchedFaculty.id}`
          );
          const h5pData = await h5pResponse.json();
          // H5P-Inhalte alphabetisch sortieren
          const sortedH5pData = h5pData.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setH5pData(sortedH5pData);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
      }
    };

    fetchH5PDataForFaculty();  }, [name]);

  // Kategorien ableiten
  const categories = ["Alle", ...new Set(h5pData.map((item) => item.category))];

  // Filtere die H5P-Inhalte nach Kategorie und Suchbegriff
  const filteredData = h5pData.filter(
    (item) =>
      (selectedCategory === "Alle" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Vorschläge für das Suchfeld (unabhängig von der Kategorie)
  const suggestions = h5pData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBoxClick = (content, infoText) => {
    setCurrentContent({ content, infoText });
    setIsPopupOpen(true);
    setShowSuggestions(false);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setCurrentContent(null);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm) {
      setShowSuggestions(true);
    }
  };
  const handleSearchBlur = () => {
    // Kurze Verzögerung, damit Klicks auf Vorschläge registriert werden
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div className={`uni-container ${isContrast ? "contrast-mode" : ""}`}>
      {/* Layout: Seitenmenü und Inhalt */}
      <div className="row g-0">
        <div className="col-md-3 p-0">
          <MaterializeFacultyMenu isContrast={isContrast} />
        </div>
        <div className="col-md-9 p-2">
          <div className="department-header">
            <h2 className="department-title">{decodeURIComponent(name)}</h2>
          </div>
          
          {/* Search field */}
          <div className="uni-search-container">
            <input
              type="text"
              placeholder="Suchen Sie nach Lernmaterialien..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="uni-search-input"
              ref={searchInputRef}
            />
            <button className="uni-search-button">
              <i className="material-icons">search</i>
            </button>
            {showSuggestions && searchTerm && (
              <div className="suggestions-dropdown">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.name}
                    </div>
                  ))
                ) : (
                  <div className="suggestion-item">
                    Keine Vorschläge gefunden
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category filter chips */}
          <div className="uni-filter-chips">
            {categories.map((category) => (
              <div 
                key={category} 
                className={`uni-filter-chip ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                <i className="material-icons">
                  {category === "Alle" ? "apps" : "folder"}
                </i>
                {category}
              </div>
            ))}
          </div>

          {/* Content cards */}
          <div className="row">
            {filteredData.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6 mb-4">
                <div 
                  className="uni-card"
                  onClick={() => handleBoxClick(
                    <PlayH5p h5pJsonPath={item.h5pJsonPath} />,
                    item.info
                  )}
                >
                  <div className="uni-card-image">
                    <img src={item.previewImage} alt={item.name} />
                  </div>
                  <div className="uni-card-content">
                    <h3 className="uni-card-title">{item.name}</h3>
                    <p className="uni-card-text">
                      {item.info.substring(0, 100)}...
                    </p>
                    <div className="uni-card-tags">
                      <span className="uni-card-tag">{item.category}</span>
                    </div>
                    <button 
                      className="uni-card-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBoxClick(
                          <PlayH5p h5pJsonPath={item.h5pJsonPath} />,
                          item.info
                        );
                      }}
                    >
                      Mehr erfahren
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isPopupOpen && (
            <Popup
              content={currentContent.content}
              infoText={currentContent.infoText}
              onClose={closePopup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;
