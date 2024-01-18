// Signup.js

import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const checkDuplicate = async () => {
    try {
      const response = await axios.post('http://localhost:5002/api/check-duplicate', {
        username,
        email,
      });

      if (response.data.exists) {
        setMessage('Username or email already exists. Please choose a different one.');
        return true; // Duplicate found
      } else {
        return false; // No duplicate
      }
    } catch (error) {
      console.error('Error checking for duplicate values:', error);
      return true; // Assume duplicate on error
    }
  };

  const handleSignup = async () => {
    // Check for duplicate values
    if (await checkDuplicate()) {
      return; // Stop signup process if duplicate values are found
    }

    try {
      // Email validation
      if (!email.endsWith('@maersk.com')) {
        setMessage('Invalid email format. Please use an email ending with "@maersk.com".');
        return;
      }

      // Password validation
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/.test(password)) {
        setMessage('Password must contain one or more special characters, alphanumeric characters, with a length between 8 and 12.');
        return;
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        setMessage('Password and Confirm Password do not match.');
        return;
      }

      // Perform signup if validations pass
      const response = await axios.post('http://localhost:5002/api/signup', {
        username,
        email,
        password,
      });

      setMessage(response.data.message);

      // Update state to indicate successful registration
      setRegistrationSuccess(true);
    } catch (error) {
      setMessage('Error during signup');
    }
  };

  return (
    <div className="auth-container">
      {registrationSuccess ? (
        <>
          <p>Registration successful! Click below to log in:</p>
          <button type="button" onClick={() => window.location.href = '/login'}>
            Login
          </button>
        </>
      ) : (
        <>
          <h2>Signup</h2>
          <form>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="button" onClick={handleSignup}>
              Signup
            </button>
            <p className="error-message">{message}</p>
          </form>
        </>
      )}
    </div>
  );
};

export default Signup;
