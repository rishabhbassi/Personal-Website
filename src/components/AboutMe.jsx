import React from "react";
import rishabhImage from "../assets/Rishabh_image.jpeg";
import resume from "../assets/Rishabh_Bassi_Resume_NonTech (2).pdf";
import "./AboutMe.css";

export default function AboutMe({ onClose, onViewResume }) {
  const aboutData = {
    name: "Rishabh Bassi",
    title: "Data Analyst | Product Engineer | UI/UX Designer",
    email: "rishabhb.career@gmail.com",
    phone: "+91 8529177707",
    location: "Sonipat, Haryana, India",
    linkedin: "rishabhbassi",
    bio: [
      "I'm a versatile technologist and creative professional with expertise in data analytics, AI systems, product engineering, and UI/UX & graphic design. I combine analytical thinking, problem-solving, and creativity to build impactful solutions across technology, business, and design domains.",
      "Currently pursuing B.Tech in Computer Science and Engineering with a Minor in Data Analytics at Manipal University Jaipur, I've gained hands-on experience through internships at Adsparkx Media, DRDO SAG, PwC, and Kuber Pipes. My work spans from building agentic architectures and conducting cryptanalysis research to solving business problems through data-driven insights.",
      "Beyond technical work, I'm passionate about leadership, having served as General Secretary of IEEE SB MUJ, Convenor of Techstars Startup Weekend, and Creative Director of TEDx MUJ. I also enjoy basketball, singing, and freelance UI/UX design work."
    ],
    education: [
      {
        degree: "Bachelor of Technology",
        institution: "Manipal University Jaipur",
        period: "Aug 2021 - Jul 2025",
        details: "Major: Computer Science and Engineering | Minor: Data Analytics | CGPA: 8.18/10.0"
      },
      {
        degree: "CBSE XII",
        institution: "Jankidas Kapur Public School",
        period: "Apr 2020 - Mar 2021",
        details: "Percentage: 85.6%"
      },
      {
        degree: "CBSE X",
        institution: "Jankidas Kapur Public School",
        period: "Apr 2018 - Mar 2019",
        details: "Percentage: 88.2%"
      }
    ],
    workExperience: [
      {
        role: "Product and Technology Intern",
        company: "Adsparkx Media",
        period: "May 2025 - Present",
        description: "Built agentic architecture, agent flows, and backend microservices for scalable generation, optimization, and automated insights. Supported product decision-making through review sessions, contributing recommendations on features, UI/UX, and workflow."
      },
      {
        role: "Research and Analysis Intern",
        company: "DRDO Scientific Analysis Group (SAG)",
        period: "Mar 2025 - May 2025",
        description: "Conducted classified cryptanalysis research to distinguish manipulated Grain cipher outputs from random bitstreams. Benchmarked analytical techniques on 100k+ samples and delivered structured performance reports under strict confidentiality."
      },
      {
        role: "Analyst Trainee",
        company: "PwC Digital Analytics Launchpad",
        period: "Feb 2024 - Jul 2024",
        description: "Selected for PwC's competitive analytics program with hands-on work in SQL, RDBMS, and AI/ML. Solved case-based business problems and produced data-driven recommendations as part of certification projects."
      },
      {
        role: "Growth and Strategy Intern",
        company: "Kuber Pipes",
        period: "Dec 2023 - Jan 2024",
        description: "Identified churn and profitability issues in the HCT product line through product and market analysis. Recommended design and process improvements using global benchmarks, strengthening overall product performance."
      }
    ],
    projects: [
      {
        title: "EV Infrastructure Planning with Geospatial ML",
        description: "Designed a location intelligence tool identifying high-demand EV charging zones, improving urban accessibility by 46%. Patent: 202411054249 A; Research paper submitted to Multimedia Tools and Applications."
      },
      {
        title: "Multi-Agent Financial Intelligence Platform",
        description: "Built an AI-powered pipeline for extracting insights and validating invoices with task-specific agents. Reduced reporting turnaround by 25% through automation of routine finance operations."
      },
      {
        title: "Consumer Behavior Analysis for Streaming Growth",
        description: "Analyzed 10 years of user data to identify key drivers behind Netflix's 300% market growth. Assessed the recommendation engine's impact, linking it to a 75% increase in user engagement through personalized content."
      }
    ],
    leadership: [
      {
        role: "General Secretary",
        organization: "IEEE SB MUJ",
        period: "May 2023 - May 2024",
        description: "Led a community of 1,000+ members and a team of 300+ students, organizing 25+ events. Spearheaded strategic initiatives that boosted member engagement by 35%."
      },
      {
        role: "Convenor",
        organization: "Techstars Google for Startups Startup Weekend Jaipur",
        period: "Mar 2023 - Oct 2023",
        description: "Orchestrated planning and execution of a city-level startup event with 100+ student volunteers. Managed logistics and secured mentorship from 30+ industry leaders."
      },
      {
        role: "Creative Director",
        organization: "TEDx ManipalUniversityJaipur",
        period: "May 2023 - Oct 2023",
        description: "Directed a team of 50+ students in speaker selection, event promotion, and creative vision. Increased audience turnout through targeted theme design and cross-platform marketing."
      }
    ],
    skills: {
      technical: [
        "Python",
        "SQL",
        "Excel",
        "Tableau",
        "MS Office",
        "Data Cleaning",
        "Data Wrangling",
        "Data Visualization",
        "Business Intelligence"
      ],
      design: [
        "UI/UX Design",
        "Graphic Design",
        "Creative Problem Solving"
      ],
      professional: [
        "Problem Solving",
        "Analytical Thinking",
        "Communication",
        "Stakeholder Management"
      ]
    },
    awards: [
      "Winner, Designathon, School of Computer Science and Engineering, MUJ",
      "2x Student Excellence Award, School of Computer Science and Engineering, MUJ",
      "Silver Certificate, Technothlon, IIT Guwahati",
      "JK Pal Memorial Award, IEEE Delhi Section"
    ],
    certifications: [
      "Meta Front-end Development",
      "Google Data Analytics",
      "IBM SQL for Data Science with Python",
      "Multi AI Agent Systems with crewAI",
      "HackerRank SQL Gold Badge",
      "HackerRank SQL Intermediate Certificate"
    ],
    resumeUrl: resume
  };

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = resume;
    link.download = "Rishabh_Bassi_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="about" className="about-me-page">
      <div className="about-me-header-nav">
        <button className="about-me-back-button" onClick={onClose}>
          ← Back
        </button>
      </div>
      <div className="about-me-container">
        <div className="about-me-header">
          <h1 className="about-me-title">About Me</h1>
        </div>

        <div className="about-me-content">
          {/* Left side - Image and basic info */}
          <div className="about-me-left">
            <div className="about-me-image-wrapper">
              <img 
                src={rishabhImage} 
                alt="Rishabh Bassi" 
                className="about-me-image"
              />
            </div>
            
            <div className="about-me-quick-info">
              <h2 className="about-me-name">{aboutData.name}</h2>
              <p className="about-me-role">{aboutData.title}</p>
              
              <div className="about-me-contact">
                <p className="about-me-contact-item">
                  <a href={`mailto:${aboutData.email}`}>{aboutData.email}</a>
                </p>
                <p className="about-me-contact-item">
                  <a href={`tel:${aboutData.phone}`}>{aboutData.phone}</a>
                </p>
                <p className="about-me-contact-item">{aboutData.location}</p>
              </div>
              
              <div className="about-me-resume-buttons">
              <button 
                  className="about-me-resume-button about-me-view-button"
                  onClick={() => {
                    if (onViewResume) {
                      onViewResume(aboutData.resumeUrl);
                    }
                  }}
                >
                  View Resume
                </button>
                <button 
                  className="about-me-resume-button"
                  onClick={handleResumeDownload}
                >
                  Download Resume
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Bio and details */}
          <div className="about-me-right">
            <div className="about-me-bio">
              <h3 className="about-me-section-title">Who am I?</h3>
              <p className="about-me-bio-text">
                I'm Rishabh Bassi — someone who loves creating things that feel thoughtful, purposeful, and a little bit artistic. I've always lived in the space where design and technology overlap, where ideas start fuzzy and become something real. Whether I'm shaping interfaces, building systems, or experimenting with data, I'm driven by curiosity and the excitement of making something that actually works for people.
              </p>
              <p className="about-me-bio-text">
                Beyond the screen, I'm a state-level basketball player and a singer who's been lucky enough to perform internationally. Those experiences taught me discipline, confidence, and the joy of expression — the same qualities I try to bring into every project I touch. For me, creativity isn't a skill; it's the way I move through the world.
              </p>
            </div>

            <div className="about-me-education">
              <h3 className="about-me-section-title">Education</h3>
              {aboutData.education.map((edu, index) => (
                <div key={index} className="about-me-education-item">
                  <div className="education-header">
                    <h4 className="education-degree">{edu.degree}</h4>
                    <span className="education-period">{edu.period}</span>
                  </div>
                  <p className="education-institution">{edu.institution}</p>
                  <p className="education-details">{edu.details}</p>
                </div>
              ))}
            </div>

            <div className="about-me-experience">
              <h3 className="about-me-section-title">Work Experience</h3>
              {aboutData.workExperience.map((exp, index) => (
                <div key={index} className="about-me-experience-item">
                  <div className="experience-header">
                    <h4 className="experience-role">{exp.role}</h4>
                    <span className="experience-period">{exp.period}</span>
                  </div>
                  <p className="experience-company">{exp.company}</p>
                  <p className="experience-description">{exp.description}</p>
                </div>
              ))}
            </div>

            <div className="about-me-projects">
              <h3 className="about-me-section-title">Projects</h3>
              {aboutData.projects.map((project, index) => (
                <div key={index} className="about-me-project-item">
                  <h4 className="project-title">{project.title}</h4>
                  <p className="project-description">{project.description}</p>
                </div>
              ))}
            </div>

            <div className="about-me-leadership">
              <h3 className="about-me-section-title">Leadership Experience</h3>
              {aboutData.leadership.map((lead, index) => (
                <div key={index} className="about-me-leadership-item">
                  <div className="leadership-header">
                    <h4 className="leadership-role">{lead.role}</h4>
                    <span className="leadership-period">{lead.period}</span>
                  </div>
                  <p className="leadership-organization">{lead.organization}</p>
                  <p className="leadership-description">{lead.description}</p>
                </div>
              ))}
            </div>

            <div className="about-me-skills">
              <h3 className="about-me-section-title">Skills & Expertise</h3>
              
              <div className="skills-category">
                <h4 className="skills-category-title">Technical</h4>
                <div className="skills-tags">
                  {aboutData.skills.technical.map((skill, index) => (
                    <span key={index} className="skill-tag skill-tag-technical">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="skills-category">
                <h4 className="skills-category-title">Design</h4>
                <div className="skills-tags">
                  {aboutData.skills.design.map((skill, index) => (
                    <span key={index} className="skill-tag skill-tag-design">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="skills-category">
                <h4 className="skills-category-title">Professional</h4>
                <div className="skills-tags">
                  {aboutData.skills.professional.map((skill, index) => (
                    <span key={index} className="skill-tag skill-tag-professional">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="about-me-awards">
              <h3 className="about-me-section-title">Awards</h3>
              <ul className="awards-list">
                {aboutData.awards.map((award, index) => (
                  <li key={index} className="award-item">{award}</li>
                ))}
              </ul>
            </div>

            <div className="about-me-certifications">
              <h3 className="about-me-section-title">Certifications</h3>
              <ul className="certifications-list">
                {aboutData.certifications.map((cert, index) => (
                  <li key={index} className="certification-item">{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

