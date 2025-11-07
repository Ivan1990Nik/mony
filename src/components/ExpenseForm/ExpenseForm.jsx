// ExpenseForm.js
import React from 'react';
import './ExpenseForm.css';

function ExpenseForm({ expenseName, setExpenseName, expenseDate, setExpenseDate, expenseAmount, setExpenseAmount, expensePriority, setExpensePriority, onAddExpense }) {
  return (
    <div className="expense-form-container">
      <h2 className="expense-form-title">Расходы</h2>
      <form className="expense-form" onSubmit={onAddExpense}>
        <label className="form-label">Название расхода:</label>
        <input 
          type="text" 
          value={expenseName} 
          onChange={(e) => setExpenseName(e.target.value)} 
          placeholder="Название расхода" 
          className="name-input"
          required 
        />
        <label className="form-label">Дата расхода:</label>
        <input 
          type="date" 
          value={expenseDate} 
          onChange={(e) => setExpenseDate(e.target.value)} 
          className="date-input"
          required 
        />
        <label className="form-label">Сумма расхода:</label>
        <input 
          type="number" 
          value={expenseAmount} 
          onChange={(e) => setExpenseAmount(e.target.value)} 
          placeholder="Сумма расхода" 
          min="0.01" 
          step="0.01" 
          className="amount-input"
          required 
        />
        <label className="form-label">Приоритет:</label>
        <select 
          value={expensePriority} 
          onChange={(e) => setExpensePriority(e.target.value)} 
          className="priority-select"
          required
        >
          <option value="Высокий">Высокий</option>
          <option value="Средний">Средний</option>
          <option value="Низкий">Низкий</option>
        </select>
        <button type="submit" className="add-expense-btn">Добавить расход</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
