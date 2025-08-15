import React, { useState, useEffect } from "react";
import "../css/QuizAllAtOnce.css";
import { fetchWithAuth } from "../utils/api";

function QuizAllAtOnce({ language, level, onEnd, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(0);

  // useEffect and handleAnswerChange are correct and remain the same...
  useEffect(() => {
    if (language && level) {
      setLoading(true);
      fetchWithAuth(`http://localhost:8080/api/quiz?lang=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setQuestions(data);
            const initialAnswers = {};
            data.forEach(q => { initialAnswers[q.questionId || q.id] = null; });
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
    if (isSubmitted) return; 
    setUserAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let score = 0;
    questions.forEach(q => {
      const questionId = q.questionId || q.id;
      if (userAnswers[questionId] === (q.rightAnswer || q.right_answer)) {
        score++;
      }
    });
    setResults(score);
    onEnd(score, questions.length);
  };

  const getOptionClassName = (question, option) => {
    if (!isSubmitted) return "option-label";
    const questionId = question.questionId || question.id;
    const rightAnswer = question.rightAnswer || question.right_answer;
    const userAnswer = userAnswers[questionId];
    if (option === rightAnswer) return "option-label correct";
    if (option === userAnswer && option !== rightAnswer) return "option-label incorrect";
    return "option-label";
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{language} Quiz - Level: {level}</h2>
        {/* ✅ Display the final score here after submission */}
        {isSubmitted && (
          <div className="quiz-final-score">
            Your Score: {results} / {questions.length}
          </div>
        )}
        <button onClick={onExit} className="exit-btn">Exit Quiz</button>
      </div>

      <div className="quiz-scroll-container">
        {/* ... The question mapping logic is correct and remains the same ... */}
        {loading ? (
            <p className="loading-text">Loading questions...</p>
        ) : questions.length > 0 ? (
            questions.map((q, index) => {
                const questionId = q.questionId || q.id;
                return (
                  <div key={questionId} className="question-block">
                    <p className="question-title">{index + 1}. {q.questionTitle || q.question_title}</p>
                    <div className="options-group">
                      {[q.option1, q.option2, q.option3, q.option4].map((option, i) => (
                        <label key={i} className={getOptionClassName(q, option)}>
                          <input type="radio" name={`question-${questionId}`} value={option} onChange={() => handleAnswerChange(questionId, option)} checked={userAnswers[questionId] === option} disabled={isSubmitted} />
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

      <div className="quiz-footer">
        {!isSubmitted && (
          <button onClick={handleSubmit} className="submit-quiz-btn" disabled={loading || questions.length === 0}>
            Submit Quiz
          </button>
        )}
        {/* ✅ Display a cleaner, simpler message in the footer */}
        {isSubmitted && (
          <p className="quiz-complete-message">
            Quiz Finished! You can review your answers above.
          </p>
        )}
      </div>
    </div>
  );
}

export default QuizAllAtOnce;
