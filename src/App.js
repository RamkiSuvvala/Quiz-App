import React, { useState } from "react";
import QuizSetup from "./QuizSetup";
import QuizAllAtOnce from "./QuizAllAtOnce";

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizConfig, setQuizConfig] = useState({});

  const handleStart = (language, level) => {
    setQuizConfig({ language, level });
    setQuizStarted(true);
  };

  const handleEnd = (score) => {
    alert(`Quiz finished! Your score: ${score}`);
    //setQuizStarted(false);
  };
  const handleExit = () => {
      setQuizStarted(false);
      setQuizConfig({});
    };
  return (
    <div className="app-container">
      {!quizStarted ? (
        <QuizSetup onStart={handleStart} />
      ) : (
        <QuizAllAtOnce
          language={quizConfig.language}
          level={quizConfig.level}
          onEnd={handleEnd}
          onExit={handleExit}
        />
      )}
    </div>
  );
}

export default App;
