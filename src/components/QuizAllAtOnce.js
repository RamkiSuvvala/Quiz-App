import React, { useState, useEffect } from "react";
import "../css/QuizAllAtOnce.css";

function QuizAllAtOnce({ language, level, onEnd, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (language && level) {
      setLoading(true);
      fetch(`http://localhost:8080/api/quiz?lang=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setQuestions(data);
            const initialAnswers = {};
            data.forEach(q => {
              initialAnswers[q.questionId || q.id] = null;
            });
            setUserAnswers(initialAnswers);
          } else {
            console.error("API did not return an array:", data);
            setQuestions([]);
          }
        })
        .catch(err => {
          console.error("Error fetching quiz questions:", err);
          setQuestions([]);
        })
        .finally(() => setLoading(false));
    }
  }, [language, level]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach(q => {
      const questionId = q.questionId || q.id;
      if (userAnswers[questionId] === (q.rightAnswer || q.right_answer)) {
        score++;
      }
    });
    onEnd(score, questions.length);
  };

  return (
    <div className="quiz-container">
      {/* 1. Static Header (always visible) */}
      <div className="quiz-header">
        <h2>{language} Quiz - Level: {level}</h2>
        <button onClick={onExit} className="exit-btn">Exit Quiz</button>
      </div>

      {/* 2. Scrollable Area (always present) */}
      <div className="quiz-scroll-container">
        {/* ✅ Show loading message OR questions inside the container */}
        {loading ? (
          <p className="loading-text">Loading questions...</p>
        ) : questions.length > 0 ? (
          questions.map((q, index) => {
            const questionId = q.questionId || q.id;
            return (
              <div key={questionId} className="question-block">
                {/* ... your question and options JSX ... */}
                 <p className="question-title">
                    {index + 1}. {q.questionTitle || q.question_title}
                </p>
                <div className="options-group">
                    {[q.option1, q.option2, q.option3, q.option4].map((option, i) => (
                    <label key={i} className="option-label">
                        <input
                        type="radio"
                        name={`question-${questionId}`}
                        value={option}
                        onChange={() => handleAnswerChange(questionId, option)}
                        checked={userAnswers[questionId] === option}
                        />
                        {option}
                    </label>
                    ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="loading-text">No questions found for this selection.</p>
        )}
      </div>

      {/* 3. Static Footer (always visible) */}
      <div className="quiz-footer">
        <button
          onClick={handleSubmit}
          className="submit-quiz-btn"
          disabled={loading || questions.length === 0}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizAllAtOnce;
