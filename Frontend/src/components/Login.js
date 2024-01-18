// Login.js

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Validate email format
      if (!email.endsWith('@maersk.com')) {
        setMessage('Invalid email format. Please use an email ending with "@maersk.com".');
        return;
      }

      // Perform login if email is valid
      const response = await axios.post('http://localhost:5002/api/login', {
        username,
        email,
        password,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Invalid username, email, or password');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Add the required attribute
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Add the required attribute
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Add the required attribute
          />
        </div>
        <button type="button" onClick={handleLogin} disabled={!username || !email || !password}>
          Login
        </button>
        <p className="error-message">{message}</p>
      </form>
    </div>
  );
};

export default Login;
