import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css'; // Make sure this CSS file exists and is styled

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold and display login errors
  const [loading, setLoading] = useState(false); // State to disable button during login attempt
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');    // Clear previous errors
    setLoading(true); // Disable the login button

    // Make the API call to your backend's sign-in endpoint
    fetch('http://localhost:8080/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Send the username and password in the request body
      body: JSON.stringify({ login: username, password: password }),
    })
    .then(response => {
      // If the response is not OK, it means login failed (e.g., 401/403 for bad credentials)
      if (!response.ok) {
        // We throw an error to be caught by the .catch() block
        throw new Error('Invalid username or password. Please try again.');
      }
      // If successful, parse the JSON response
       console.log('If successful, parse the JSON response');
      return response.json();
    })
    .then(data => {
      // The backend should return a JSON object like { "accessToken": "..." }
      if (data.accessToken) {
        // Store the token securely in the browser's local storage
        localStorage.setItem('accessToken', data.accessToken);
        
        // Call the onLogin function passed from App.js to update the user state
        onLogin(data); // Pass user info up to the parent component
        console.log('Redirect the user to the main page after a successful login');
        // Redirect the user to the main page after a successful login
        navigate('/');
      } else {
        // This case handles if the server responds 200 OK but doesn't send a token
        throw new Error('Login failed: No access token was received from the server.');
      }
    })
    .catch(err => {
      // Catch any network errors or thrown errors from the .then() block
      console.error('Login Error:', err);
      setError(err.message); // Set the error message to be displayed to the user
    })
    .finally(() => {
      setLoading(false); // Re-enable the login button whether login succeeded or failed
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>User Login</h2>

        {/* Display an error message if the 'error' state is not empty */}
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {/* The button is disabled while the login request is in progress */}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      <p className="form-switch-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>

      </form>
    </div>
  );
}

export default Login;
