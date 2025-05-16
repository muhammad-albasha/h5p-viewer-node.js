import React, { useState, useEffect, useRef } from "react";
import PlayH5p from "./PlayH5p";
import Popup from "./Popup";

const PlayH5pGrid = ({ isContrast }) => {
  const [h5pData, setH5pData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 Karten pro Seite
  const [expandedCardId, setExpandedCardId] = useState(null); // State to track which card is expanded

  const searchInputRef = useRef(null);
  const expandedCardRef = useRef(null);

  // H5P-Daten laden
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/h5pContent`)
      .then((response) => response.json())
      .then((data) => {
        // Alphabetisch sortieren
        const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));
        setH5pData(sortedData);
      })
      .catch(console.error);  }, []);
  // Kategorien ableiten
  const categories = ["Alle", ...new Set(h5pData.map((item) => item.category))];

  // Gefilterte Daten für den Slider (nach Kategorie und Suche)
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

  // Vorschläge basierend auf dem Suchbegriff (unabhängig von der Kategorie)
  const suggestions = h5pData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );  // Handle card click to expand/collapse
  const handleCardClick = (id, h5pJsonPath) => {
    if (expandedCardId === id) {
      // If clicking on the already expanded card, collapse it
      setExpandedCardId(null);
    } else {
      // If clicking on a different card, expand it
      setExpandedCardId(id);
      
      // Scroll to the expanded card
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
  // For backward compatibility - open in popup if needed (currently not used as expanded cards are preferred)
  /* 
  const openInPopup = (content, infoText) => {
    setCurrentContent({ content, infoText });
    setIsPopupOpen(true);
    setShowSuggestions(false);
  };
  */

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
    // Kurze Verzögerung, damit ein Klick auf einen Vorschlag registriert wird
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };
  
  return (
    <div
      className={`uni-container ${isContrast ? "contrast-mode" : ""}`}
    >      {/* Search field */}
      <div className="uni-search-container">
        <input
          type="text"
          placeholder="Lernmaterialien suchen..."
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
              <div className="suggestion-item">Keine Vorschläge gefunden</div>
            )}
          </div>
        )}
      </div>

      {/* Category filter chips */}
      <div className="uni-filter-chips">
        {categories.map((category) => (          <div 
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
      </div>      {/* Content cards */}
      <div className="uni-card-list">
        {currentItems.map((item) => (
          <div 
            key={item.id} 
            className={`uni-card-list-item ${expandedCardId === item.id ? "expanded" : ""}`}
            ref={expandedCardId === item.id ? expandedCardRef : null}
          >              <div 
              className={`uni-card uni-card-horizontal ${expandedCardId === item.id ? "expanded" : ""}`}
              onClick={() => handleCardClick(item.id, item.h5pJsonPath)}
            >
              <div className="uni-card-image">
                <img src={item.previewImage} alt={item.name} />
              </div>              <div className="uni-card-content">
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
            </div>            {/* Expandable content section */}
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

      {filteredData.length === 0 && (
        <div className="uni-empty-state">
          <p>Keine Inhalte gefunden. Bitte versuchen Sie eine andere Suche oder Kategorie.</p>
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
  );
};

export default PlayH5pGrid;
