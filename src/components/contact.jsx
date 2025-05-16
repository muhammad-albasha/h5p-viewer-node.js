import React from "react";
import MaterializeContainer from "./MaterializeContainer";

const Contact = ({ isContrast }) => {
  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Kontakt</h2>
      </div>
      
      <div className="uni-content">
        <div className="uni-contact-card">
          <div className="uni-contact-info">
            <h3>Ansprechpartnerin</h3>
            <p className="uni-contact-name">Dr. Heike Seehagen-Marx</p>
            
            <div className="uni-contact-address">
              <p>Bergische Universität Wuppertal</p>
              <p>Zentrum für Informations- und Medienverarbeitung (ZIM)</p>
              <p>
                <a 
                  target="_blank"
                  className="uni-link"
                  href="https://medialab.uni-wuppertal.de"
                  rel="noreferrer"
                >
                  Medienlabor
                </a>
              </p>
            </div>
            
            <div className="uni-contact-details">
              <p>
                <i className="material-icons">phone</i>
                <span>0202- 439 2028</span>
              </p>
              <p>
                <i className="material-icons">email</i>
                <a 
                  className="uni-link" 
                  href="mailto:h.seehagen-marx@uni-wuppertal.de"
                >
                  h.seehagen-marx@uni-wuppertal.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MaterializeContainer>
  );
};

export default Contact;
