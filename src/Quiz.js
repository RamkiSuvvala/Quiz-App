import React, { useEffect, useState } from "react";

function Quiz({ language, level, onEnd }) {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Build URL with query parameters
    const url = `http://localhost:2015/api/quiz?lang=${encodeURIComponent(language)}&level=${encodeURIComponent(level)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      });
  }, [language, level]);

  if (loading) return <p>Loading questions...</p>;

  if (!questions.length) return <p>No questions received.</p>;

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (answer === questions[current].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(() => {
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        onEnd(score + (answer === questions[current].correctAnswer ? 1 : 0));
      }
    }, 1200);
  };

  const q = questions[current];

  return (
    <div className="quiz-container">
      <h2>
        Q{current + 1}: {q.question}
      </h2>
      <div className="answers-list">
        {q.answers.map((ans, idx) => (
          <button
            key={idx}
            className={`answer-btn ${
              selected && ans === q.correctAnswer
                ? "correct"
                : selected === ans
                ? "selected"
                : ""
            }`}
            onClick={() => !selected && handleAnswer(ans)}
            disabled={!!selected}
          >
            {ans}
          </button>
        ))}
      </div>
      <p>
        Question {current + 1} / {questions.length}
      </p>
    </div>
  );
}

export default Quiz;