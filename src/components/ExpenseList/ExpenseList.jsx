import React from 'react';

function ExpenseList({ expenses, onDeleteExpense }) {
  return (
    <div>
      <h2>Список расходов</h2>
      <ul>
        {expenses.map((exp, idx) => (
          <li key={idx} className={exp.priority === 'Высокий' ? 'red' : exp.priority === 'Средний' ? 'orange' : 'green'}>
            {exp.name} ({exp.date}): {exp.amount.toFixed(2)} руб. [Приоритет: {exp.priority}]
            <button onClick={() => onDeleteExpense(idx)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseList;
