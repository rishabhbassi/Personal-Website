import React from "react";
import fullResearchPaperPDF from "../assets/Full_Research_Paper.pdf";
import predictivePlacementPDF from "../assets/Predictive_Placement_And_Routing_Of_Charging_Station_For_Electric_Vehicles-4.pdf";
import "./ResearchSection.css";

export default function ResearchSection({ onPaperClick, onClose }) {
  // Research papers data
  const researchPapers = [
    {
      id: 1,
      title: "Predictive Placement And Routing Of Charging Station For Electric Vehicles",
      authors: "Rishabh Bassi",
      year: "2024",
      description: "A comprehensive study on predictive placement and routing strategies for electric vehicle charging stations to optimize infrastructure planning and user convenience.",
      pdfUrl: predictivePlacementPDF,
    },
    {
      id: 2,
      title: "Artificial Intelligence for Disease Detection and Patient Data Management in Medicare",
      authors: "Rishabh Bassi",
      year: "2024",
      description: "An innovative approach leveraging artificial intelligence technologies to enhance disease detection accuracy and streamline patient data management systems within the Medicare framework, improving healthcare outcomes and operational efficiency.",
      pdfUrl: fullResearchPaperPDF,
    },
  ];

  return (
    <div className="research-section">
      <div className="research-header-nav">
        <button className="research-back-button" onClick={onClose}>
          ← Back
        </button>
      </div>
      <div className="research-container">
        <div className="research-header">
          <h1 className="research-heading">Research Papers</h1>
        </div>
        <div className="research-cards-grid">
          {researchPapers.map((paper) => (
            <div
              key={paper.id}
              className="research-card"
              onClick={() => onPaperClick(paper)}
            >
              <div className="research-card-content">
                <h3 className="research-card-title">{paper.title}</h3>
                <p className="research-card-authors">{paper.authors}</p>
                <p className="research-card-year">{paper.year}</p>
                <p className="research-card-description">{paper.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

