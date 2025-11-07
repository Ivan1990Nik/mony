import React, { useState, useEffect } from 'react';
import './App.css'; // Для стилей

function App() {
  const [incomes, setIncomes] = useState([]); // Массив доступных доходов: [{ date: '2023-10-01', amount: 6720 }]
  const [expenses, setExpenses] = useState([]); // Массив расходов: [{ name: 'Квартира', amount: 500, date: '2023-10-01', priority: 'Средний' }]
  const [savings, setSavings] = useState(0); // Общая сумма заначки
  const [wallet, setWallet] = useState(0); // Общая сумма кошелька
  const [calculation, setCalculation] = useState(null); // Результат расчета
  const [totalRemaining, setTotalRemaining] = useState(0); // Остаток доступных доходов после покрытия расходов
  const [history, setHistory] = useState([]); // История операций: [{ timestamp: '2023-10-01T12:00:00.000Z', description: '...' }]
  const [showHistory, setShowHistory] = useState(false); // Флаг для показа/скрытия истории

  // Состояния для формы доходов
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  // Состояния для формы расходов
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expensePriority, setExpensePriority] = useState('Средний'); // Новое состояние для приоритета

  // Состояние для использования из кошелька
  const [useFromWallet, setUseFromWallet] = useState('');

  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const savedIncomes = localStorage.getItem('incomes');
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    const savedSavings = localStorage.getItem('savings');
    if (savedSavings) {
      setSavings(parseFloat(savedSavings) || 0);
    }
    const savedWallet = localStorage.getItem('wallet');
    if (savedWallet) {
      setWallet(parseFloat(savedWallet) || 0);
    }
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Сохранение данных в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('savings', savings.toString());
  }, [savings]);

  useEffect(() => {
    localStorage.setItem('wallet', wallet.toString());
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  // Добавление дохода через форму (с округлением и распределением)
  const handleAddIncome = (e) => {
    e.preventDefault();
    const amount = parseFloat(incomeAmount);
    if (incomeDate && !isNaN(amount) && amount > 0) {
      // Округление вниз до ближайших 1000 руб.
      const roundedAmount = Math.floor(amount / 1000) * 1000;
      // 10% в заначку
      const savingsAmount = roundedAmount * 0.1;
      // Остаток от округления в кошелёк
      const walletAmount = amount - roundedAmount;
      // 90% от округлённой суммы доступно для расходов
      const availableAmount = roundedAmount * 0.9;

      setSavings(prev => prev + savingsAmount);
      setWallet(prev => prev + walletAmount);
      setIncomes([...incomes, { date: incomeDate, amount: availableAmount }]);

      setHistory([...history, { 
        timestamp: new Date().toISOString(), 
        description: `Добавлен доход: ${incomeDate}, ${amount.toFixed(2)} руб. (округлено до ${roundedAmount.toFixed(2)} руб.). В заначку: ${savingsAmount.toFixed(2)} руб., в кошелёк: ${walletAmount.toFixed(2)} руб., доступно для расходов: ${availableAmount.toFixed(2)} руб.` 
      }]);

      setIncomeDate('');
      setIncomeAmount('');
    } else {
      alert('Пожалуйста, введите корректную дату и сумму дохода.');
    }
  };

  // Добавление расхода через форму (теперь с приоритетом)
  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (expenseName && expenseDate && !isNaN(amount) && amount > 0 && expensePriority) {
      setExpenses([...expenses, { name: expenseName, amount, date: expenseDate, priority: expensePriority }]);
      setHistory([...history, { timestamp: new Date().toISOString(), description: `Добавлен расход: ${expenseName}, ${amount.toFixed(2)} руб., дата: ${expenseDate}, приоритет: ${expensePriority}` }]);
      setExpenseName('');
      setExpenseAmount('');
      setExpenseDate('');
      setExpensePriority('Средний'); // Сбрасываем к дефолту
    } else {
      alert('Пожалуйста, введите корректное название, дату, сумму расхода и выберите приоритет.');
    }
  };

  // Удаление дохода
  const handleDeleteIncome = (index) => {
    const deleted = incomes[index];
    setIncomes(incomes.filter((_, i) => i !== index));
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Удалён доход: ${deleted.date}, ${deleted.amount.toFixed(2)} руб.` }]);
  };

  // Удаление расхода
  const handleDeleteExpense = (index) => {
    const deleted = expenses[index];
    setExpenses(expenses.filter((_, i) => i !== index));
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Удалён расход: ${deleted.name}, ${deleted.amount.toFixed(2)} руб., дата: ${deleted.date}, приоритет: ${deleted.priority}` }]);
  };

  // Сброс заначки
  const handleResetSavings = () => {
    const previousSavings = savings;
    setSavings(0);
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Заначка сброшена: было ${previousSavings.toFixed(2)} руб., теперь 0 руб.` }]);
  };

  // Сброс кошелька
  const handleResetWallet = () => {
    const previousWallet = wallet;
    setWallet(0);
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Кошелёк сброшен: было ${previousWallet.toFixed(2)} руб., теперь 0 руб.` }]);
  };

  // Удаление записи из истории
  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  // Расчет: распределение расходов по доступным доходам (с возможным использованием кошелька; расходы сортируются по приоритету, затем по дате)
  const calculate = () => {
    const walletAmount = parseFloat(useFromWallet) || 0;
    if (walletAmount > wallet || walletAmount < 0) {
      alert('Сумма из кошелька должна быть положительной и не превышать доступное в кошельке.');
      return;
    }

    let remainingIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (walletAmount > 0) {
      remainingIncomes.push({ date: 'Из кошелька', amount: walletAmount });
    }

    const priorityOrder = { 'Высокий': 1, 'Средний': 2, 'Низкий': 3 };
    let remainingExpenses = [...expenses].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.date) - new Date(b.date);
    });
    let result = [];

    for (let expense of remainingExpenses) {
      let expenseCovered = false;
      for (let income of remainingIncomes) {
        if (income.amount > 0) {
          const coverAmount = Math.min(income.amount, expense.amount);
          result.push(`${expense.name} (${expense.amount.toFixed(2)} руб., дата: ${expense.date}, приоритет: ${expense.priority}) покрыто доходом от ${income.date} на ${coverAmount.toFixed(2)} руб.`);
          income.amount -= coverAmount;
          expense.amount -= coverAmount;
          if (expense.amount <= 0) {
            expenseCovered = true;
            break;
          }
        }
      }
      if (!expenseCovered && expense.amount > 0) {
        result.push(`${expense.name} (дата: ${expense.date}, приоритет: ${expense.priority}) не полностью покрыто (осталось ${expense.amount.toFixed(2)} руб.)`);
      }
    }

    const totalRemainingAmount = remainingIncomes
      .filter(inc => inc.date !== 'Из кошелька')
      .reduce((sum, inc) => sum + inc.amount, 0);
    setTotalRemaining(totalRemainingAmount);

    setCalculation(result);

    if (walletAmount > 0) {
      setWallet(prev => prev - walletAmount);
      setUseFromWallet('');
    }

    setHistory([...history, { timestamp: new Date().toISOString(), description: `Выполнен расчёт: использован кошелёк ${walletAmount.toFixed(2)} руб., остаток доходов: ${totalRemainingAmount.toFixed(2)} руб.` }]);
  };

  // JSX
  return (
    <div className="App">
      <h1>Бюджетное приложение</h1>

      <div>
        <h2>Заначка</h2>
        <p>Общая сумма: {savings.toFixed(2)} руб.</p>
        <p>Примечание: Фиксированные 10% от округлённой суммы дохода идут в заначку.</p>
        <button onClick={handleResetSavings}>Сбросить заначку</button>
      </div>

      <div>
        <h2>Кошелек</h2>
        <p>Общая сумма: {wallet.toFixed(2)} руб.</p>
        <p>Примечание: Вы можете взять деньги из кошелька для покрытия расходов.</p>
        <button onClick={handleResetWallet}>Сбросить кошелек</button>
        {wallet > 0 && (
          <div>
            <label>Использовать из кошелька для расходов (руб.):</label>
            <input
              type="number"
              value={useFromWallet}
              onChange={(e) => setUseFromWallet(e.target.value)}
              placeholder="Сумма"
              min="0"
              step="0.01"
              max={wallet}
            />
          </div>
        )}
      </div>

      <div>
        <h2>Доходы (доступные для расходов)</h2>
        <form onSubmit={handleAddIncome}>
          <input
            type="date"
            value={incomeDate}
            onChange={(e) => setIncomeDate(e.target.value)}
            placeholder="Дата дохода"
            required
          />
          <input
            type="number"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
            placeholder="Сумма дохода"
            min="0.01"
            step="0.01"
            required
          />
          <button type="submit">Добавить доход</button>
        </form>
        <p>Примечание: Сумма округляется вниз до ближайших 1000 руб. <br />
          10% уйдёт в заначку, <br />
           остаток от округления — в кошелек, остальное (90%) доступно для расходов.</p>
        <ul>
          {incomes.map((inc, idx) => (
            <li key={idx}>
              {inc.date}: {inc.amount.toFixed(2)} руб. 
              <button onClick={() => handleDeleteIncome(idx)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Расходы</h2>
        <form onSubmit={handleAddExpense}>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            placeholder="Название расхода"
            required
          />
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            placeholder="Дата расхода"
            required
          />
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="Сумма расхода"
            min="0.01"
            step="0.01"
            required
          />
          <select value={expensePriority} onChange={(e) => setExpensePriority(e.target.value)} required>
            <option value="Высокий">Высокий</option>
            <option value="Средний">Средний</option>
            <option value="Низкий">Низкий</option>
          </select>
          <button type="submit">Добавить расход</button>
        </form>
        <ul>
          {expenses.map((exp, idx) => (
            <li key={idx} style={{ 
              color: exp.priority === 'Высокий' ? 'red' : exp.priority === 'Средний' ? 'orange' : 'green',
              fontWeight: exp.priority === 'Высокий' ? 'bold' : 'normal'
            }}>
              {exp.name} ({exp.date}): {exp.amount.toFixed(2)} руб. [Приоритет: {exp.priority}]
              <button onClick={() => handleDeleteExpense(idx)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={calculate}>Рассчитать</button>

      {calculation && (
        <div>
          <h2>Результат</h2>
          <ul>
            {calculation.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {totalRemaining !== null && (
        <div>
          <h2>Остаток</h2>
          <p>После покрытия расходов: {totalRemaining.toFixed(2)} руб.</p>
        </div>
      )}

      <div>
        <h2>История операций</h2>
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Скрыть историю' : 'Показать историю'}
        </button>
        {showHistory && (
          <ul>
            {history.length > 0 ? (
              history.map((entry, idx) => (
                <li key={idx}>
                  {new Date(entry.timestamp).toLocaleString('ru-RU')} - {entry.description}
                  <button onClick={() => handleDeleteHistory(idx)}>Удалить</button>
                </li>
              ))
            ) : (
              <li>История пуста.</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
