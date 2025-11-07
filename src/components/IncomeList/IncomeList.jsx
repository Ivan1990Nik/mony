import React from 'react';
import './IncomeList.css';  // Добавляем импорт стилей

function IncomeList({ incomes, onDeleteIncome }) {
  return (
    <div className="income-list">
      <h2 className="income-list-title">Список доходов</h2>
      <ul className="income-list-items">
        {incomes.map((inc, idx) => (
          <li key={idx} className="income-list-item">
            <span className="income-name">{inc.name}</span>
            <span className="income-date">({inc.date})</span>
            <span className="income-amount">{inc.amount.toFixed(2)} руб.</span>
            <button 
              className="income-delete-btn" 
              onClick={() => onDeleteIncome(idx)}
              aria-label={`Удалить доход: ${inc.name} на сумму ${inc.amount.toFixed(2)} руб.`}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncomeList;
