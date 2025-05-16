import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PlayH5p from "./PlayH5p";
import Popup from "./Popup";
import MaterializeFacultyMenu from "./MaterializeFacultyMenu";

const FacultyDetail = ({ isContrast }) => {
  const { name } = useParams();
  const [h5pData, setH5pData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null); // State für erweiterte Karte
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 Karten pro Seite

  const searchInputRef = useRef(null);
  const expandedCardRef = useRef(null);

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

    fetchH5PDataForFaculty();
  }, [name]);

  // Kategorien ableiten
  const categories = ["Alle", ...new Set(h5pData.map((item) => item.category))];

  // Filtere die H5P-Inhalte nach Kategorie und Suchbegriff
  const filteredData = h5pData.filter(
    (item) =>
      (selectedCategory === "Alle" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginierung
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Seitenwechsel Funktionen
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Vorschläge für das Suchfeld (unabhängig von der Kategorie)
  const suggestions = h5pData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Card Click für Erweiterung/Kollabierung
  const handleCardClick = (id, h5pJsonPath) => {
    if (expandedCardId === id) {
      // Wenn Klick auf bereits erweiterte Karte, einklappen
      setExpandedCardId(null);
    } else {
      // Wenn Klick auf andere Karte, erweitern
      setExpandedCardId(id);
      
      // Scrollen zur erweiterten Karte
      setTimeout(() => {
        if (expandedCardRef.current) {
          expandedCardRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  // Popup-Methoden für Abwärtskompatibilität
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
    setCurrentPage(1); // Zurück zu Seite 1 bei Vorschlagsauswahl
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
        
        {/* Platzhalter zwischen Menü und Inhalt */}
        <div className="col-md-9 p-0">
          <div className="uni-content-wrapper p-2">
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
                  setCurrentPage(1); // Zurück zu Seite 1 bei Änderung der Suche
                  setShowSuggestions(true);
                }}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="uni-search-input"
                ref={searchInputRef}
              />
              <button 
                className="uni-search-button"
                aria-label="Suchen"
                onClick={() => {
                  // Bei leerem Suchfeld nichts tun
                  if (searchTerm.trim() !== '') {
                    setCurrentPage(1);
                    setShowSuggestions(false);
                  }
                }}
              >
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
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1); // Zurück zu Seite 1 bei Änderung der Kategorie
                  }}
                >
                  <i className="material-icons">
                    {category === "Alle" ? "apps" : "folder"}
                  </i>
                  {category}
                </div>
              ))}
            </div>

            {/* Content cards */}
            <div className="uni-card-list">
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`uni-card-list-item ${expandedCardId === item.id ? "expanded" : ""}`}
                  ref={expandedCardId === item.id ? expandedCardRef : null}
                >
                  <div 
                    className={`uni-card uni-card-horizontal ${expandedCardId === item.id ? "expanded" : ""}`}
                    onClick={() => handleCardClick(item.id, item.h5pJsonPath)}
                  >
                    <div className="uni-card-image">
                      <img src={item.previewImage} alt={item.name} />
                    </div>
                    <div className="uni-card-content">
                      <h3 className="uni-card-title">{item.name}</h3>
                      <p className="uni-card-text">
                        {item.info.substring(0, 150)}...
                      </p>
                      <div className="uni-card-footer">
                        <div className="uni-card-tags">
                          <span className="uni-card-tag">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="uni-card-icon-button"
                      aria-label={expandedCardId === item.id ? "Schließen" : "Öffnen"}
                      title={expandedCardId === item.id ? "Schließen" : "Öffnen"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item.id, item.h5pJsonPath);
                      }}
                    >
                      <i className="material-icons">
                        {expandedCardId === item.id ? "keyboard_arrow_up" : "play_arrow"}
                      </i>
                    </button>
                  </div>
                  {/* Expandable content section */}
                  {expandedCardId === item.id && (
                    <div className="uni-card-expanded-content" aria-label="Expandierte H5P Inhalte">
                      <div className="uni-card-expanded-layout">
                        <div className="uni-card-h5p-container">
                          <PlayH5p h5pJsonPath={item.h5pJsonPath} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="uni-pagination">
                <button 
                  onClick={goToPreviousPage} 
                  className={`uni-pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
                  disabled={currentPage === 1}
                  aria-label="Vorherige Seite"
                >
                  <i className="material-icons">chevron_left</i>
                </button>
                
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`uni-pagination-item ${currentPage === number + 1 ? 'active' : ''}`}
                    aria-label={`Seite ${number + 1}`}
                    aria-current={currentPage === number + 1 ? 'page' : undefined}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button 
                  onClick={goToNextPage} 
                  className={`uni-pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
                  disabled={currentPage === totalPages}
                  aria-label="Nächste Seite"
                >
                  <i className="material-icons">chevron_right</i>
                </button>
              </div>
            )}

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
    </div>
  );
};

export default FacultyDetail;
