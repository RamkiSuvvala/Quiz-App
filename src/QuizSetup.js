import React, { useState } from "react";
import "./QuizSetup.css"; // We'll mention the CSS below

function QuizSetup({ onStart }) {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");

  const handleStart = () => {
    if (language && level) {
      onStart(language, level);
    } else {
      alert("Please select both language and level!");
    }
  };

  return (
    <div className="quiz-setup-container">
      <h2 className="quiz-setup-title">Select Language & Level</h2>
      <div className="quiz-setup-field">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="english">English</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>
      </div>
      <div className="quiz-setup-field">
        <label htmlFor="level">Level:</label>
        <select
          id="level"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <button className="quiz-setup-button" onClick={handleStart}>
        Start Quiz
      </button>
    </div>
  );
}

export default QuizSetup;
