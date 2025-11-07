// IncomeForm.js
import React from 'react';
import './IncomeForm.css';

function IncomeForm({ incomeDate, setIncomeDate, incomeAmount, setIncomeAmount, onAddIncome }) {
  return (
    <div className="income-form-container">
      <h2 className="income-form-title">Доходы (доступные для расходов)</h2>
      <form className="income-form" onSubmit={onAddIncome}>
        <label className="form-label">Дата дохода:</label>
        <input 
          type="date" 
          value={incomeDate} 
          onChange={(e) => setIncomeDate(e.target.value)} 
          className="date-input"
          required 
        />
        <label className="form-label">Сумма дохода:</label>
        <input 
          type="number" 
          value={incomeAmount} 
          onChange={(e) => setIncomeAmount(e.target.value)} 
          placeholder="Сумма дохода" 
          min="0.01" 
          step="0.01" 
          className="amount-input"
          required 
        />
        <button type="submit" className="add-income-btn">Добавить доход</button>
      </form>
      <p className="note">Примечание: Сумма округляется вниз до ближайших 1000 руб. 10% в заначку, остаток от округления в кошелёк, 90% доступно для расходов.</p>
    </div>
  );
}

export default IncomeForm;

