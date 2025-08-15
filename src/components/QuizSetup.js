import React, { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";
import "../css/QuizSetup.css";

function QuizSetup({ onStart }) {
  const [categories, setCategories] = useState([]);
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    // ✅ Use the helper function instead of the standard fetch
    fetchWithAuth("http://localhost:8080/api/quiz/categories")
      .then((res) => {
        if (!res.ok) {
          // Handle potential errors like an expired token
          throw new Error("Failed to fetch categories. Please log in again.");
        }
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleStart = () => {
    if (language && level) {
      onStart(language, level);
    } else {
      alert("Please select both a language and a level!");
    }
  };

  return (
    <div className="quiz-setup-container">
      <h2 className="quiz-setup-title">Select Language & Level</h2>

      <div className="quiz-setup-field">
        <label htmlFor="language">Language:</label>
        <div className="select-wrapper">
          <select
            id="language"
            value={language} // ✅ FIX: Use 'language' state for the value
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">-- Select Language --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="quiz-setup-field">
        <label htmlFor="level">Level:</label>
        <div className="select-wrapper">
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">-- Select Level --</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <button className="quiz-setup-button" onClick={handleStart}>
        Start Quiz
      </button>
    </div>
  );
}

export default QuizSetup;
