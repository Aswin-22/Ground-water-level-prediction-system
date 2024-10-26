import React from "react";
import "../homestyle.css"; // Adjust this path if necessary

// Import images from assets
import introImage from "../assets/intro.png";
import seaWavesIcon from "../assets/sea-waves.png";
import waterCrisisIcon from "../assets/water-crisis.png";
import waterSystemIcon from "../assets/water-system.png";
import featuresImage from "../assets/features.jpg";
import statImage from "../assets/Untitled Project (2).jpg";

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div id="hero">
        <div id="hero-container">
          <h1>Predict and Monitor Groundwater Levels</h1>
          <p>
            Stay informed with accurate data and insights to manage water
            resources efficiently.
          </p>
          <a href="#about" className="hero-button">
            Learn More
          </a>
        </div>
      </div>

      {/* Intro Section */}
      <div id="intro-section">
        <div id="intro-content">
          <div className="intro-text">
            <h2>Leveraging Data to Predict Groundwater Levels</h2>
            <p>
              Our groundwater level prediction web application uses data
              analytics and AI to help monitor and manage groundwater resources,
              ensuring sustainable water usage across various regions.
            </p>
          </div>
          <div className="intro-image">
            <img src={introImage} alt="Groundwater Map" width="400" />
          </div>
        </div>

        {/* Intro Stats Section */}
        <div id="intro-stats">
          <div className="stat-item">
            <img src={seaWavesIcon} alt="Sea Waves Icon" width="50" />
            <h3>60%</h3>
            <p>
              of India's water demand is fulfilled by groundwater resources.
            </p>
          </div>
          <div className="stat-item">
            <img src={waterCrisisIcon} alt="Water Crisis Icon" width="50" />
            <h3>21</h3>
            <p>states facing significant groundwater depletion.</p>
          </div>
          <div className="stat-item">
            <img src={waterSystemIcon} alt="Water System Icon" width="50" />
            <h3>40%</h3>
            <p>of total irrigation water comes from groundwater.</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features">
        <div id="feature-middle">
          <h2>Features</h2>
          <img src={featuresImage} alt="Features" />
        </div>
        <div id="feature-left-top">
          <div className="feature-left-item">
            <h3>Map - Locate and Predict</h3>
            <p>
              Identify groundwater levels on an interactive map and predict
              future trends.
            </p>
            <a href="#map">Explore</a>
          </div>
          <div className="feature-left-item">
            <h3>Visualization - Analysis</h3>
            <p>
              Analyze groundwater data with dynamic charts and graphs for better
              insights.
            </p>
            <a href="#visualization">Explore</a>
          </div>
        </div>
        <div id="feature-left-bottom">
          <div className="feature-left-item">
            <h3>Forecast</h3>
            <p>
              Forecast future groundwater levels based on historical trends and
              patterns.
            </p>
            <a href="#forecast">Explore</a>
          </div>
          <div className="feature-left-item">
            <h3>Comparison</h3>
            <p>
              Compare groundwater levels across different regions and time
              periods.
            </p>
            <a href="#comparison">Explore</a>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div id="stat">
        <h2>Statistics</h2>
        <div id="stat-container">
          <div className="stat-image">
            <div className="stat-shadow"></div>
            <img src={statImage} alt="Groundwater Map" width="400" />
          </div>
          <div className="stat-text">
            <div className="intro-text-item">
              <h3>Identification of Critical Changes</h3>
              <p>
                The section helps to identify critical changes and patterns in
                groundwater levels.
              </p>
            </div>
            <div className="intro-text-item">
              <h3>Real-Time Updates</h3>
              <p>
                Access the latest data and real-time updates for a current view
                of groundwater status.
              </p>
            </div>
            <div className="intro-text-item">
              <h3>Deeper Data Insights</h3>
              <p>Dive deeper into the data to see the full picture.</p>
              <a href="#insights">Explore</a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>What is HydroScope?</h3>
          <p>
            HydroScope is a web-based tool that helps users predict and monitor
            groundwater levels across various regions in India. It uses
            historical data and machine learning algorithms to provide insights
            into groundwater conditions.
          </p>
        </div>
        <div className="faq-item">
          <h3>How does HydroScope predict groundwater levels?</h3>
          <p>
            HydroScope leverages machine learning models trained on historical
            data, climate conditions, and other relevant factors to predict
            groundwater level trends. The predictions are aimed at providing
            valuable insights for water resource management.
          </p>
        </div>
        <div className="faq-item">
          <h3>Who can benefit from using HydroScope?</h3>
          <p>
            The tool is designed for a wide range of users including farmers,
            researchers, environmentalists, policymakers, and anyone concerned
            with sustainable water management practices.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I use HydroScope for my region?</h3>
          <p>
            Yes, HydroScope covers various states and districts in India. You
            can enter your state and district to access groundwater data
            specific to your area and view predictions and trends.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
