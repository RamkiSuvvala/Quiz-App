// src/components/LandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";

// Importing images from src/assets
import bg1 from "../assets/quiz-bg-1.jpg";
import bg2 from "../assets/quiz-bg-2.jpg";
import bg3 from "../assets/quiz-bg-3.jpg";
import bg4 from "../assets/quiz-bg-4.jpg";

const images = [bg1, bg2, bg3, bg4];

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true); // Fade back in
      }, 1000); // Fade duration matches CSS transition
    }, 4000); // Change every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      <div
        className={`bg-image ${fade ? "fade-in" : "fade-out"}`}
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />
      <div className="overlay">
        <h1 className="landing-title">Welcome to the Quiz App</h1>
        <button className="landing-button" onClick={() => navigate("/quiz-setup")}>
          Take a Quiz
        </button>
      </div>
    </div>
  );
}
