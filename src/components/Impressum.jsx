import React from "react";
import MaterializeContainer from "./MaterializeContainer";

const Impressum = ({ isContrast }) => {
  return (
    <MaterializeContainer isContrast={isContrast}>
      <div className="department-header">
        <h2 className="department-title">Impressum</h2>
      </div>
      
      <div className="uni-content">
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          Bergische Universität Wuppertal<br />
          Gaußstraße 20<br />
          42119 Wuppertal
        </p>
        
        <h3>Kontakt</h3>
        <p>
          Telefon: 0202/439-0<br />
          E-Mail: info@uni-wuppertal.de
        </p>
        
        <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>
          Der Rektor der Bergischen Universität Wuppertal<br />
          Prof. Dr. Lambert T. Koch<br />
          Gaußstraße 20<br />
          42119 Wuppertal
        </p>
        
        <h3>Haftungsausschluss</h3>
        <p>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. 
          Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>
      </div>
    </MaterializeContainer>
  );
};

export default Impressum;
