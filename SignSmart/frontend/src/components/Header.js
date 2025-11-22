import React from 'react';

const Header = ({ currentUser, onSignIn, onSignUp, onSignOut }) => {
  return (
    <header className="signsmart-header">
      <div className="logo">
        <div className="logo-icon"></div>
        <div className="logo-text">SignSmart</div>
      </div>
      <div className="user-info" style={{ display: currentUser ? 'flex' : 'none' }}>
        <div className="user-avatar">{currentUser?.avatar}</div>
        <span>{currentUser?.name}</span>
        <button className="btn-secondary" onClick={onSignOut}>Sign Out</button>
      </div>
      <div id="auth-buttons" style={{ display: currentUser ? 'none' : 'block' }}>
        <button className="btn-primary" onClick={onSignIn}>Sign In</button>
        <button className="btn-secondary" onClick={onSignUp}>Sign Up</button>
      </div>
    </header>
  );
};

export default Header;