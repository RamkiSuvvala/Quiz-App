import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css'; // We can reuse the same CSS as the login form

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role is USER
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username, password: password, role: role }),
    })
    .then(response => {
      if (!response.ok) {
        // Handle errors, e.g., username already exists (which might be a 400 or 409 status)
        return response.text().then(text => { throw new Error(text || 'Sign-up failed') });
      }
      // If sign-up is successful (e.g., status 201 Created)
      alert('Sign-up successful! Please log in.');
      navigate('/login'); // Redirect to the login page
    })
    .catch(err => {
      console.error('Sign-up Error:', err);
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignUp}>
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            required
          />
        </div>
        
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <p className="form-switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
