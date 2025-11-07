// History.js
import React from 'react';
import './History.css';

function History({ history, showHistory, setShowHistory, onDeleteHistory }) {
  return (
    <div className="history-container">
      <h2 className="history-title">История операций</h2>
      <button 
        onClick={() => setShowHistory(!showHistory)} 
        className="toggle-history-btn"
        aria-label={showHistory ? "Скрыть историю операций" : "Показать историю операций"}
      >
        {showHistory ? 'Скрыть историю' : 'Показать историю'}
      </button>
      {showHistory && (
        <ul className="history-list">
          {history.length > 0 ? (
            history.map((entry, idx) => (
              <li key={idx} className="history-item">
                <span className="history-timestamp">{new Date(entry.timestamp).toLocaleString('ru-RU')}</span> - 
                <span className="history-description">{entry.description}</span>
                <button 
                  onClick={() => onDeleteHistory(idx)} 
                  className="delete-history-btn"
                  aria-label={`Удалить запись: ${entry.description}`}
                >
                  Удалить
                </button>
              </li>
            ))
          ) : (
            <li className="history-empty">История пуста.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default History;
