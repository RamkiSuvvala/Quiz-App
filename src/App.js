import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

// Import all your components
import Login from './components/Login';
import QuizSetup from './components/QuizSetup';
import QuizAllAtOnce from './components/QuizAllAtOnce';
import AddQuestion from './components/AddQuestion';
import ManageQuestionsByCategory from "./components/ManageQuestionsByCategory";
import EditQuestion from "./components/EditQuestion";
import SignUp from './components/SignUp.js'; 
import { jwtDecode } from 'jwt-decode';
import LandingPage from "./components/LandingPage";

// Your CSS imports
import './css/App.css'; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [quizConfig, setQuizConfig] = useState({ language: '', level: '' });

  // ✅ This effect runs once on app load to check for an existing token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    // ✅ THIS IS THE FIX: Only decode if the token actually exists
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Optional but recommended: Check if the token is expired
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser({
            username: decodedUser.sub,
            role: decodedUser.role
          });
        } else {
          // Token is expired, so remove it
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        // This catches any error during decoding, like a malformed token
        console.error("Invalid token found in localStorage", error);
        localStorage.removeItem('accessToken');
      }
    }
  }, []); 

  const handleLogin = (data) => {
    // Expects to receive the data object: { accessToken: "..." }
    if (data && data.accessToken) {
      const token = data.accessToken; // Extract the token string
      localStorage.setItem('accessToken', token);
      const decodedUser = jwtDecode(token);
      console.log(decodedUser);
      setUser({
        username: decodedUser.sub,
        role: decodedUser.role
      });
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear the token on logout
    setUser(null);
    navigate('/login');
  };

  const handleStart = (language, level) => {
    setQuizConfig({ language, level });
    navigate('/quiz');
  };

  const handleEnd = (score, totalQuestions) => {
    alert(`Quiz finished! Your score: ${score} out of ${totalQuestions}`);
    // I see you've commented this out, which is fine. The user stays on the quiz page.
    // navigate("/"); 
  };

  // If user is not logged in, render the public login and signup routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} /> {/* ✅ THIS IS THE ADDED LINE */}
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
              {user.role == 'ADMIN' && (
                <>
                  <Link to="/add" className="nav-btn">Add Question</Link>
                  <Link to="/manage" className="nav-btn">Manage Questions</Link>
                </>
              )}
              
            </>
          )}
          <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz-setup" element={<QuizSetup onStart={handleStart} />} />
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
       {/* Footer */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Quiz Application. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;