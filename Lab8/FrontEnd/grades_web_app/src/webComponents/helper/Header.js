import React from 'react';

function Header({ user, onLogout }) {
  return (
    <div className="dashboard-header">
      <h2>
        Welcome {user.first_name}! <span className="user-role">({user.user_type})</span>
      </h2>
      <button className="signout-button" onClick={onLogout}>Sign Out</button>
    </div>
  );
}

export default Header;
