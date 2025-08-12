import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Import all your components
import Login from './components/Login';
import QuizSetup from './components/QuizSetup';
import QuizAllAtOnce from './components/QuizAllAtOnce';
import AddQuestion from './components/AddQuestion';
import ManageQuestionsByCategory from "./components/ManageQuestionsByCategory";
import EditQuestion from "./components/EditQuestion";

// Your CSS imports
import './css/App.css'; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ language: '', level: '' });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleStart = (language, level) => {
    setQuizConfig({ language, level });
    navigate('/quiz');
  };

  const handleEnd = (score, totalQuestions) => {
    alert(`Quiz finished! Your score: ${score} out of ${totalQuestions}`);
    navigate("/");
  };

  // If user is not logged in, render only the Login route
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // If user is logged in, render the main application
  return (
    <>
      <header className="app-header">
        <h1>Quiz Application</h1>
        <nav>
          {location.pathname !== '/quiz' && (
            <>
              <Link to="/" className="nav-btn">Home</Link>
              <Link to="/add" className="nav-btn">Add Question</Link>
              <Link to="/manage" className="nav-btn">Manage Questions</Link>
            </>
          )}
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<QuizSetup onStart={handleStart} />} />
          
          {/* ✅ THE FIX IS HERE: Pass all required props to QuizAllAtOnce */}
          <Route
            path="/quiz"
            element={
              <QuizAllAtOnce
                language={quizConfig.language}
                level={quizConfig.level}
                onEnd={handleEnd}
                onExit={() => navigate("/")}
              />
            }
          />
          
          <Route path="/add" element={<AddQuestion />} />
          <Route path="/manage" element={<ManageQuestionsByCategory />} />
          <Route path="/manage/:id/edit" element={<EditQuestion />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
