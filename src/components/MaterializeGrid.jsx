// MaterializeGrid.jsx
import React from "react";
import PropTypes from "prop-types";
import "../materializeStyles.css";

/**
 * A grid component for displaying content in a responsive layout following the Bergische Universität Wuppertal theme
 */
const MaterializeGrid = ({
  children,
  columns = 3,
  gap = "medium",
  className = "",
  isContrast = false,
}) => {
  // Calculate the gap value based on the prop
  const gapValue = {
    small: "10px",
    medium: "20px",
    large: "30px",
  }[gap] || gap;

  // Inline style for the grid
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: gapValue,
  };

  // Responsive styles - on smaller screens, reduce columns
  const mediaQueryStyle = `
    @media (max-width: 992px) {
      .uni-grid {
        grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
      }
    }
    @media (max-width: 576px) {
      .uni-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style>{mediaQueryStyle}</style>
      <div 
        className={`uni-grid ${isContrast ? "contrast-mode" : ""} ${className}`} 
        style={gridStyle}
      >
        {children}
      </div>
    </>
  );
};

MaterializeGrid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number,
  gap: PropTypes.string,
  className: PropTypes.string,
  isContrast: PropTypes.bool,
};

export default MaterializeGrid;
