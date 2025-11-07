import React from 'react';

function IncomeList({ incomes, onDeleteIncome }) {
  return (
    <div>
      <h2>Список доходов</h2>
      <ul>
        {incomes.map((inc, idx) => (
          <li key={idx}>
            {inc.date}: {inc.amount.toFixed(2)} руб.
            <button onClick={() => onDeleteIncome(idx)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IncomeList;
