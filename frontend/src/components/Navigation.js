import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="signsmart-nav">
      <button className="hamburger" onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </button>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>
            <span role="img" aria-label="home">🏠</span> Home
          </Link>
        </li>
        <li>
          <Link to="/games" className={isActive('/games')} onClick={() => setIsMenuOpen(false)}>
            <span role="img" aria-label="games">🎮</span> Games
          </Link>
        </li>
        <li>
          <Link to="/lessons" className={isActive('/lessons')} onClick={() => setIsMenuOpen(false)}>
            <span role="img" aria-label="lessons">📚</span> Lessons
          </Link>
        </li>
        <li>
          <Link to="/gallery" className={isActive('/gallery')} onClick={() => setIsMenuOpen(false)}>
            <span role="img" aria-label="gallery">🖼️</span> Gallery
          </Link>
        </li>
        <li>
          <Link to="/about" className={isActive('/about')} onClick={() => setIsMenuOpen(false)}>
            <span role="img" aria-label="about">ℹ️</span> About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;