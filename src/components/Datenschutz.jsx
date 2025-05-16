import React from "react";
import MaterializeContainer from "./MaterializeContainer";

const Datenschutz = ({ isContrast }) => {
  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Datenschutz</h2>
      </div>
      
      <div className="uni-content">
        <p>
          Die Bergische Universität Wuppertal nimmt den Schutz Ihrer persönlichen Daten sehr ernst. 
          Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen 
          Datenschutzvorschriften sowie dieser Datenschutzerklärung.
        </p>
        
        <h3>Erhebung und Verarbeitung von Daten</h3>
        <p>
          Bei der Nutzung dieser H5P-Viewer-Anwendung werden verschiedene personenbezogene Daten erhoben. 
          Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. 
          Diese Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen.
        </p>
        
        <h3>Cookies</h3>
        <p>
          Diese Webseite verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. 
          Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert. 
          Die meisten der von uns verwendeten Cookies sind so genannte "Session-Cookies". 
          Sie werden nach Ende Ihres Besuchs automatisch gelöscht.
        </p>
        
        <h3>Kontakt</h3>
        <p>
          Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, 
          Berichtigung, Löschung oder Sperrung von Daten wenden Sie sich bitte an den Datenschutzbeauftragten 
          der Bergischen Universität Wuppertal.
        </p>
      </div>
    </MaterializeContainer>
  );
};

export default Datenschutz;
