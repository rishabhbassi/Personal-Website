import fullResearchPaperPDF from "../assets/Full_Research_Paper.pdf";
import predictivePlacementPDF from "../assets/Predictive_Placement_And_Routing_Of_Charging_Station_For_Electric_Vehicles-4.pdf";

export const researchPapers = [
  {
    id: "ev-charging",
    index: "01",
    title: "Predictive Placement And Routing Of Charging Station For Electric Vehicles",
    authors: ["Nachiketa Jha", "Rishabh Bassi", "Shishir Singh Chauhan"],
    authorLine: "Nachiketa Jha, Rishabh Bassi, Shishir Singh Chauhan",
    date: "May 2024",
    year: "2024",
    pages: 19,
    type: "Prototype study",
    field: "Mobility / Applied ML",
    pdfUrl: predictivePlacementPDF,
    pdfSize: "0.7 MB",
    downloadName: "Rishabh_Bassi_EV_Charging_Placement.pdf",
    lede: "Can machine learning suggest where EV charging stations should go, while a routing layer guides drivers to the nearest one? A 2024 prototype tested both halves of that question in Delhi.",
    summary:
      "A Random Forest placement model paired with Dijkstra routing, built as a feasibility prototype for EV charging infrastructure in Delhi.",
    tags: ["Random Forest", "Dijkstra", "Delhi"],
    takeaway:
      "A useful blueprint for combining placement and routing, not a validated siting tool. The predictor's negative R² and generated training set are central caveats.",
    sections: [
      {
        id: "context",
        number: "01",
        kicker: "Context",
        title: "The problem: plan ahead, not just react",
        paragraphs: [
          "EV adoption depends on drivers trusting that a charge is within reach. The paper frames that range anxiety as an infrastructure planning problem: stations have traditionally been placed where demand already exists, a reactive approach that can waste resources and struggle as travel patterns change.",
          "The authors propose pairing two models. One predicts promising locations for new charging stations; the other routes a driver to the closest suitable station when their current charge cannot cover the trip.",
        ],
      },
      {
        id: "method",
        number: "02",
        kicker: "Method",
        title: "How the prototype works",
        paragraphs: [
          "The routing side plots Delhi EV charging stations on an OpenStreetMap road graph built with OSMnx. A driver supplies a current location, destination, battery charge, and available charging time. Dijkstra's algorithm finds the shortest path; if the estimated range cannot cover it, the model reroutes to the nearest station. The prototype assumes one hour of charging adds 60 km of range.",
          "The placement side uses a Random Forest regressor to predict latitude and longitude from population density, traffic congestion, urbanisation level, and distance to highways. Repeating the prediction is meant to produce a list of candidate sites for planners.",
        ],
        callout: {
          label: "The data caveat",
          text: "The authors could not find a dataset covering every location and attribute they needed. They trained the placement model on 100 generated Delhi hotspot rows with random attribute values, then replaced the top five with real values as a sanity check.",
        },
      },
      {
        id: "results",
        number: "03",
        kicker: "Reported results",
        title: "What the experiments report",
        paragraphs: [
          "The paper reports coordinate-level errors for the placement model. The routing prototype is described qualitatively: it directed a test user to the nearest station, and the predicted placement fell within roughly 5 km of the starting hotspot.",
        ],
        metrics: {
          caption: "Placement model scores as reported in the paper",
          columns: ["Target", "MSE", "RMSE", "MAE", "R²"],
          rows: [
            ["Latitude", "0.04", "0.21", "0.16", "−0.19"],
            ["Longitude", "0.05", "0.22", "0.16", "−0.16"],
          ],
        },
        note: {
          label: "How to read the scores",
          text: "An R² below zero means the model explained less variance than a constant baseline on the held-out split. The coordinate errors may look small at city scale, but these results are a pipeline check, not evidence of real-world siting accuracy.",
        },
      },
      {
        id: "limits",
        number: "04",
        kicker: "Limits",
        title: "What remains unproven",
        points: [
          {
            label: "Generated training data",
            text: "Random attribute values cannot represent Delhi's actual population, traffic, or highway access, so the predictor's learned relationships are not grounded in observed conditions.",
          },
          {
            label: "One city, small sample",
            text: "The study uses Delhi hotspots and does not test whether the approach transfers to another city or a full station network.",
          },
          {
            label: "Routing without benchmarks",
            text: "The routing layer is evaluated through a walkthrough rather than travel-time, energy, or reliability benchmarks.",
          },
          {
            label: "Adjacent predictions",
            text: "The authors note that different starting locations can produce neighbouring output coordinates, which would waste resources if those sites were built. Preventing this is left to future work.",
          },
          {
            label: "Simplified range model",
            text: "A fixed 60 km per charging hour ignores vehicle efficiency, traffic, weather, and charger power differences.",
          },
        ],
      },
    ],
    futureWork:
      "The authors point toward richer real-world datasets, avoidance of adjacent station predictions, and factors such as renewable energy availability, economic conditions, and government policy.",
  },
  {
    id: "health-ai",
    index: "02",
    title: "Leveraging Artificial Intelligence for Disease Detection and Patient Data Management in Medicare",
    authors: ["Rishabh Bassi", "Sagi Sanketh Raju"],
    authorLine: "Rishabh Bassi, Sagi Sanketh Raju",
    date: "2024",
    year: "2024",
    pages: 4,
    type: "Review + proposal",
    field: "Health AI / Data systems",
    pdfUrl: fullResearchPaperPDF,
    pdfSize: "1.1 MB",
    downloadName: "Rishabh_Bassi_AI_Medicare_Review.pdf",
    lede: "A literature review that maps how AI could support diagnosis and patient data in Medicare, alongside a proposed study design for putting those ideas into practice.",
    summary:
      "A review of AI for disease detection and patient data management, plus a proposed framework spanning imaging, EHRs, privacy, bias, and interoperability.",
    tags: ["Medical imaging", "EHR / NLP", "Health equity"],
    takeaway:
      "A structured map of the opportunity and its ethical constraints. It is a review and proposal, not a study with measured results.",
    sections: [
      {
        id: "scope",
        number: "01",
        kicker: "Scope",
        title: "Two problems, one review",
        paragraphs: [
          "The paper examines two connected areas in Medicare: detecting disease earlier and more accurately, and managing the patient data those decisions depend on. It reviews recent research, implementation examples, and challenges, then proposes a methodology for further work.",
          "The scope spans medical imaging, electronic health records, predictive analytics, privacy, bias, interoperability, and regulation. That breadth makes it a useful orientation to the field, but not a narrow empirical test of one model.",
        ],
      },
      {
        id: "opportunity",
        number: "02",
        kicker: "Opportunity",
        title: "Where AI could help",
        points: [
          {
            label: "Medical imaging",
            text: "Deep learning models can detect patterns in X-rays, MRIs, and CT scans, with the review citing cancer, cardiovascular, and neurological conditions as target areas.",
          },
          {
            label: "Earlier risk detection",
            text: "Combining images, records, and genetic data could help identify high-risk patients and support more personalised treatment planning.",
          },
          {
            label: "Clinical notes and EHRs",
            text: "Natural language processing can extract structured information from unstructured notes, while automation can reduce administrative coding and data-entry work.",
          },
          {
            label: "Data sharing",
            text: "AI-enabled records could make accurate patient information more readily available across providers, supporting coordination across the care pathway.",
          },
        ],
        paragraphs: [
          "The review uses IBM Watson for Oncology and Google Health's diabetic retinopathy research as examples of AI moving into clinical workflows. They are presented as cited case studies, not as original evaluations conducted by the authors.",
        ],
      },
      {
        id: "proposal",
        number: "03",
        kicker: "Proposed method",
        title: "The study design the paper outlines",
        paragraphs: [
          "The methodology reads as a plan. Data would come from collaborating healthcare institutions, then be anonymised, cleaned, and prepared for two model families: convolutional neural networks for images, and recurrent or transformer models for clinical text.",
          "Evaluation would use accuracy, precision, recall, F1-score, and AUC-ROC. Governance is part of the design: HIPAA-aligned handling, bias detection and fairness-aware methods, institutional review board approval, and interoperability through HL7 and FHIR standards.",
        ],
        points: [
          {
            label: "Real-world validation",
            text: "Models would be tested in collaborating healthcare settings rather than only offline.",
          },
          {
            label: "Clinician feedback",
            text: "Usability and acceptability would be assessed with the people expected to use the system.",
          },
        ],
      },
      {
        id: "limits",
        number: "04",
        kicker: "Limits",
        title: "What the paper does not establish",
        points: [
          {
            label: "No primary dataset",
            text: "The paper reviews existing work and proposes a methodology. It does not collect a new clinical dataset or train and evaluate a model.",
          },
          {
            label: "No measured outcomes",
            text: "Because no experiment is run, it cannot establish accuracy, clinical benefit, or cost savings. Those claims would need a separate empirical study.",
          },
          {
            label: "Open governance questions",
            text: "Privacy, algorithmic bias, regulatory approval, and interoperability are identified as challenges. Naming them is not the same as proving a safe implementation.",
          },
          {
            label: "Broad scope",
            text: "The review spans imaging, records, and system design. Each area is complex enough to require its own specialist literature and validation.",
          },
        ],
        callout: {
          label: "Read it as a proposal",
          text: "The value of this paper is the map it draws: where AI might fit, what evidence would be needed, and which ethical and operational questions must be answered before deployment.",
        },
      },
    ],
    futureWork:
      "The proposed next steps are empirical: build the models with partner institutions, validate them in real clinical settings, measure performance, and test interoperability and clinician usability.",
  },
];

export default researchPapers;
