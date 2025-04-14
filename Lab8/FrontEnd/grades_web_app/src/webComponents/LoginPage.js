import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');

  const [login, setLogin] = useState(true); // saying if the user is trying to login or sign up. changes by using the sign in / sign up buttons
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // for signup


  const clearFields = () => {
    setUsername('');
    setPassword('');
    setFirstname('');
    setLastname('');
    setError('');
    setMessage('');
  };
  
  const renderAuthToggle = () => {
    let promptText;
    let buttonText;
    let handleClick;
  
    if (login) {
      promptText = "Don't have an account?";
      buttonText = "Sign Up";
      handleClick = () => {
        setLogin(false);
        clearFields();
        setError('');
      };
    } else {
      promptText = "Already have an account?";
      buttonText = "Sign In";
      handleClick = () => {
        setLogin(true);
        clearFields();
        setError('');
      };
    }

    return (
      <span>
        {promptText}{" "}
        <button type="button" className="text-button" onClick={handleClick}>
          {buttonText}
        </button>
      </span>
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });    

    if(login){
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      console.log(data.user);
      if (response.ok) {
        setError('');
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    }
    else{
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, first_name, last_name, user_type: 'student' })
      });
      const data = await response.json();
      console.log(data.user);
      if (response.ok) {
        setMessage("Successfully signed up.");
        setError('');
      } else {
        setError(data.message);
        setMessage('');
      }
    }

  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Hustler's University</h2>
      <input
          type="text"
          placeholder={login ? "Username" : "Choose a username *"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={login ? "Password" : "Create a password *"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      {!login && <input type="text" placeholder="First Name *" value={first_name} onChange={(e) => setFirstname(e.target.value)} required/>}
      {!login && <input type="text" placeholder="Last Name *" value={last_name} onChange={(e) => setLastname(e.target.value)}  required />}

      {!login && <p className="user-role">You are signing up as a <strong>student</strong>.</p>}
      <div className="auth-toggle-text">
        {renderAuthToggle()}
      </div>
      {!login && message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

export default LoginPage;