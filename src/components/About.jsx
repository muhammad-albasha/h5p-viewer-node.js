import React from "react";
import MaterializeContainer from "./MaterializeContainer";

const About = ({ isContrast }) => {
  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Über uns</h2>
      </div>
      
      <div className="uni-content">
        <p>
          Die H5P-Viewer-Anwendung der Bergischen Universität Wuppertal bietet einen modernen und nutzerfreundlichen Zugang zu interaktiven Lernmaterialien. Unsere Plattform dient der Fakultät für Mathematik und Naturwissenschaften, um Studierenden hochwertige digitale Bildungsinhalte zur Verfügung zu stellen.
        </p>
        
        <h3>Unser Ziel</h3>
        <p>
          Wir möchten Bildung interaktiver und zugänglicher gestalten. Durch den Einsatz von H5P-Technologie können Studierende aktiv lernen, ihr Wissen testen und unmittelbares Feedback erhalten. Die Plattform ist darauf ausgelegt, das Lernerlebnis zu verbessern und den Wissenstransfer zu fördern.
        </p>
        
        <h3>Über H5P</h3>
        <p>
          H5P ist eine offene und kostenlose Technologie, die es ermöglicht, interaktive Inhalte zu erstellen, zu teilen und wiederzuverwenden. Die Inhalte können verschiedene Formen annehmen, wie z.B. interaktive Videos, Präsentationen, Quizze und mehr.
        </p>
      </div>
    </MaterializeContainer>
  );
};

export default About;
