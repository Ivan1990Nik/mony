import React from 'react';
import './ExpenseList.css';  // Добавляем импорт стилей

function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div className="expense-list">
      <h2 className="expense-list-title">Список расходов</h2>
      <ul className="expense-list-items">
        {expenses.map((exp, idx) => (
          <li key={idx} className={`expense-list-item ${exp.priority === 'Высокий' ? 'priority-high' : exp.priority === 'Средний' ? 'priority-medium' : 'priority-low'}`}>
            <span className="expense-name">{exp.name}</span>
            <span className="expense-date">({exp.date})</span>
            <span className="expense-amount">{exp.amount.toFixed(2)} руб.</span>
            <span className="expense-priority">[Приоритет: {exp.priority}]</span>
            <button 
              className="expense-delete-btn" 
              onClick={() => onDeleteExpense(idx)}
              aria-label={`Удалить расход: ${exp.name} на сумму ${exp.amount.toFixed(2)} руб.`}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
