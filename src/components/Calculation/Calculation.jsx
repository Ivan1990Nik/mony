// Calculation.js
import React from 'react';
import './Calculation.css';

function Calculation({ incomes, expenses, onCalculate, calculation, totalRemaining }) {
  return (
    <div className="calculation-container">
      <button 
        onClick={onCalculate} 
        disabled={expenses.length === 0} 
        className="calculate-btn"
      >
        Рассчитать
      </button>
      {calculation && (
        <div className="result-section">
          <h2 className="result-title">Результат</h2>
          <ul className="result-list">
            {calculation.map((item, idx) => <li key={idx} className="result-item">{item}</li>)}
          </ul>
        </div>
      )}
      {totalRemaining !== null && (
        <div className="remaining-section">
          <h2 className="remaining-title">Остаток</h2>
          <p className="remaining-amount">После покрытия расходов: {totalRemaining.toFixed(2)} руб.</p>
        </div>
      )}
    </div>
  );
}

export default Calculation;
