import React from "react";
import MaterializeContainer from "./MaterializeContainer";

const LeichteSprache = ({ isContrast }) => {
  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Leichte Sprache</h2>
      </div>
      
      <div className="uni-content uni-easy-language">
        <div className="uni-easy-language-section">
          <h3>Was ist die H5P-Viewer App?</h3>
          <p>
            Mit der H5P-Viewer App können Sie lernen.<br />
            Es gibt viele verschiedene Inhalte.<br />
            Die Inhalte sind interaktiv.<br />
            Das bedeutet: Sie können mitmachen.<br />
          </p>
        </div>
        
        <div className="uni-easy-language-section">
          <h3>Wie funktioniert die App?</h3>
          <p>
            Klicken Sie auf ein Thema.<br />
            Wählen Sie einen Inhalt.<br />
            Lernen Sie mit den interaktiven Inhalten.<br />
            Sie können Videos sehen.<br />
            Sie können Aufgaben lösen.<br />
          </p>
        </div>
        
        <div className="uni-easy-language-section">
          <h3>Wer hat diese App gemacht?</h3>
          <p>
            Die App wurde von der Bergischen Universität Wuppertal gemacht.<br />
            Die App ist für die Fakultät für Mathematik und Naturwissenschaften.<br />
            Studierende können mit der App lernen.<br />
          </p>
        </div>
      </div>
    </MaterializeContainer>
  );
};

export default LeichteSprache;
