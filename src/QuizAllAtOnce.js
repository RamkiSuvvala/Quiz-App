import React, { useEffect, useState } from "react";
import './QuizAllAtOnce.css';

function QuizAllAtOnce({ language, level, onEnd,onExit }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // key: question index, value: answer
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const url = `http://localhost:2015/api/quiz?lang=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions); // your questions with option1..4 fields
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [language, level]);

  const handleSelect = (qIndex, answer) => {
    if (!submitted) {
      setSelectedAnswers(prev => ({ ...prev, [qIndex]: answer }));
    }
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
    if (onEnd) onEnd(calculatedScore);
  };

  if (loading) return <p>Loading questions...</p>;
  if (!questions.length) return <p>No questions found.</p>;

  return (
    <div className="quiz-container">
      <h2>Quiz - {language} - {level}</h2>

      {questions.map((q, i) => {
        const options = [q.option1, q.option2, q.option3, q.option4];
        return (
          <div key={i} className="question-block" style={{ marginBottom: "1.5em" }}>
            <h3>{i + 1}. {q.question}</h3>
            <form>
              {options.map((option, idx) => {
                // Determine styling based on selection & submission
                const isSelected = selectedAnswers[i] === option;
                const isCorrect = submitted && option === q.correctAnswer;
                const isWrongSelected = submitted && isSelected && option !== q.correctAnswer;

                return (
                  <label key={idx} 
                         style={{
                           display: "block",
                           marginBottom: "0.5em",
                           cursor: submitted ? "default" : "pointer",
                           backgroundColor: isCorrect ? "#d4edda" : isWrongSelected ? "#f8d7da" : "transparent",
                           padding: "0.4em 0.6em",
                           borderRadius: "4px",
                         }}>
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={option}
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => handleSelect(i, option)}
                      style={{ marginRight: "0.8em" }}
                    />
                    {option}
                  </label>
                );
              })}
            </form>
          </div>
        );
      })}

      <div style={{ marginTop: "1.5em", display: "flex", gap: "1rem", justifyContent: "center" }}>
        {!submitted && (
          <>
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== questions.length}
              style={{
                padding: "0.75em 2em",
                fontSize: "1.15rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: Object.keys(selectedAnswers).length === questions.length ? "#28a745" : "#6c757d",
                color: "#fff",
                cursor: Object.keys(selectedAnswers).length === questions.length ? "pointer" : "not-allowed",
              }}
            >
              Submit Quiz
            </button>
            <button
              onClick={onExit}
              type="button"
              style={{
                padding: "0.75em 2em",
                fontSize: "1.15rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Exit
            </button>
          </>
        )}

        {submitted && (
          <>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: "auto 0" }}>
              Your score: {score} / {questions.length}
            </p>
            <button
              onClick={onExit}
              type="button"
              style={{
                padding: "0.75em 2em",
                fontSize: "1.15rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#dc3545",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Exit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizAllAtOnce;

