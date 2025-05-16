// MaterializeContainer.jsx
import React from "react";
import PropTypes from "prop-types";
import "../materializeStyles.css";

/**
 * A container component following the Bergische Universität Wuppertal theme
 */
const MaterializeContainer = ({
  children,
  withDepth = false,
  fadeIn = false,
  fullWidth = false,
  className = "",
  isContrast = false,
}) => {
  const containerClasses = [
    "uni-container",
    withDepth ? "uni-depth" : "",
    fadeIn ? "uni-fade-in" : "",
    fullWidth ? "uni-container-fluid" : "",
    isContrast ? "contrast-mode" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClasses}>{children}</div>;
};

MaterializeContainer.propTypes = {
  children: PropTypes.node.isRequired,
  withDepth: PropTypes.bool,
  fadeIn: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  isContrast: PropTypes.bool,
};

export default MaterializeContainer;
