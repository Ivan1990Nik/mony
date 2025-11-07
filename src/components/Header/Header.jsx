import React from 'react';
import './Header.css';

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="header">
      <h1>💰 Финансовый Менеджер</h1>
      {/* <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? '☀️ Светлый' : '🌙 Тёмный'}
      </button> */}
    </header>
  );
}

export default Header;
