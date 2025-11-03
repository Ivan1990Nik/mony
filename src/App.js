import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Для стилей, если нужно

function App() {
  const [incomes, setIncomes] = useState([]); // Массив доступных доходов: [{ date: '2023-10-01', amount: 6720 }] (90% от округлённой суммы)
  const [expenses, setExpenses] = useState([]); // Массив расходов: [{ name: 'Квартира', amount: 500, date: '2023-10-01' }]
  const [savings, setSavings] = useState(0); // Общая сумма заначки
  const [wallet, setWallet] = useState(0); // Общая сумма кошелька (остаток от округления)
  const [calculation, setCalculation] = useState(null); // Результат расчета
  const [totalRemaining, setTotalRemaining] = useState(0); // Остаток доступных доходов после покрытия расходов
  const [history, setHistory] = useState([]); // История операций: теперь массив объектов [{ timestamp: '2023-10-01T12:00:00.000Z', description: '...' }]
  const [showHistory, setShowHistory] = useState(false); // Флаг для показа/скрытия истории

  // Состояния для формы доходов
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');

  // Состояния для формы расходов
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(''); // Новое состояние для даты расхода

  // Состояние для использования из кошелька
  const [useFromWallet, setUseFromWallet] = useState('');

  // Флаг для предотвращения двойной загрузки и преждевременного сохранения
  const isLoaded = useRef(false);

  // Загрузка данных из localStorage при монтировании компонента (только один раз)
  useEffect(() => {
    if (!isLoaded.current) {
      try {
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
        isLoaded.current = true; // Устанавливаем флаг после загрузки
      } catch (error) {
        // Ошибка загрузки (можно добавить обработку, если нужно)
      }
    }
  }, []);

  // Сохранение incomes в localStorage при изменении (только после загрузки)
  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem('incomes', JSON.stringify(incomes));
      } catch (error) {
        // Ошибка сохранения (можно добавить обработку, если нужно)
      }
    }
  }, [incomes]);

  // Сохранение expenses в localStorage при изменении (только после загрузки)
  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem('expenses', JSON.stringify(expenses));
      } catch (error) {
        // Ошибка сохранения (можно добавить обработку, если нужно)
      }
    }
  }, [expenses]);

  // Сохранение savings в localStorage при изменении (только после загрузки)
  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem('savings', savings.toString());
      } catch (error) {
        // Ошибка сохранения (можно добавить обработку, если нужно)
      }
    }
  }, [savings]);

  // Сохранение wallet в localStorage при изменении (только после загрузки)
  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem('wallet', wallet.toString());
      } catch (error) {
        // Ошибка сохранения (можно добавить обработку, если нужно)
      }
    }
  }, [wallet]);

  // Сохранение history в localStorage при изменении (только после загрузки)
  useEffect(() => {
    if (isLoaded.current) {
      try {
        localStorage.setItem('history', JSON.stringify(history));
      } catch (error) {
        // Ошибка сохранения (можно добавить обработку, если нужно)
      }
    }
  }, [history]);

  // Добавление дохода через форму (с округлением и распределением; фиксированный 10% в заначку)
  const handleAddIncome = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const amount = parseFloat(incomeAmount);
    if (incomeDate && !isNaN(amount) && amount > 0) {
      const rounded = Math.floor(amount / 1000) * 1000; // Округление вниз до 1000
      const walletAmount = amount - rounded; // Остаток в кошелек
      const savingsAmount = rounded * 0.1; // Фиксированные 10% в заначку от округлённой суммы
      const availableAmount = rounded - savingsAmount; // Остальное (90%) доступно для расходов
      setSavings(prev => prev + savingsAmount);
      setWallet(prev => prev + walletAmount);
      setIncomes([...incomes, { date: incomeDate, amount: availableAmount }]);
      // Добавляем в историю с timestamp
      setHistory([...history, { timestamp: new Date().toISOString(), description: `Добавлен доход: ${incomeDate}, ${availableAmount.toFixed(2)} руб. (заначка: +${savingsAmount.toFixed(2)}, кошелек: +${walletAmount.toFixed(2)})` }]);
      setIncomeDate(''); // Сбрасываем инпуты
      setIncomeAmount('');
    } else {
      alert('Пожалуйста, введите корректную дату и сумму дохода.');
    }
  };

  // Добавление расхода через форму (теперь с датой)
  const handleAddExpense = (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    const amount = parseFloat(expenseAmount);
    if (expenseName && expenseDate && !isNaN(amount) && amount > 0) {
      setExpenses([...expenses, { name: expenseName, amount, date: expenseDate }]);
      // Добавляем в историю с timestamp
      setHistory([...history, { timestamp: new Date().toISOString(), description: `Добавлен расход: ${expenseName}, ${amount.toFixed(2)} руб., дата: ${expenseDate}` }]);
      setExpenseName(''); // Сбрасываем инпуты
      setExpenseAmount('');
      setExpenseDate('');
    } else {
      alert('Пожалуйста, введите корректное название, дату и сумму расхода.');
    }
  };

  // Удаление дохода (удаляем только доступную сумму; заначка и кошелек остаются)
  const handleDeleteIncome = (index) => {
    const deleted = incomes[index];
    setIncomes(incomes.filter((_, i) => i !== index));
    // Добавляем в историю с timestamp
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Удалён доход: ${deleted.date}, ${deleted.amount.toFixed(2)} руб.` }]);
  };

  // Удаление расхода
  const handleDeleteExpense = (index) => {
    const deleted = expenses[index];
    setExpenses(expenses.filter((_, i) => i !== index));
    // Добавляем в историю с timestamp
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Удалён расход: ${deleted.name}, ${deleted.amount.toFixed(2)} руб., дата: ${deleted.date}` }]);
  };

  // Сброс заначки
  const handleResetSavings = () => {
    const previousSavings = savings;
    setSavings(0);
    // Добавляем в историю с timestamp
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Заначка сброшена: было ${previousSavings.toFixed(2)} руб., теперь 0 руб.` }]);
  };

  // Сброс кошелька
  const handleResetWallet = () => {
    const previousWallet = wallet;
    setWallet(0);
    // Добавляем в историю с timestamp
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Кошелёк сброшен: было ${previousWallet.toFixed(2)} руб., теперь 0 руб.` }]);
  };

  // Удаление записи из истории
  const handleDeleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  // Расчет: распределение расходов по доступным доходам (с возможным использованием кошелька; расходы сортируются по дате)
  const calculate = () => {
    const walletAmount = parseFloat(useFromWallet) || 0;
    if (walletAmount > wallet || walletAmount < 0) {
      alert('Сумма из кошелька должна быть положительной и не превышать доступное в кошельке.');
      return;
    }

    let remainingIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортировка по дате
    // Добавляем сумму из кошелька как дополнительный "доход" (без даты, обрабатывается последним)
    if (walletAmount > 0) {
      remainingIncomes.push({ date: 'Из кошелька', amount: walletAmount });
    }

    let remainingExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортировка расходов по дате
    let result = [];

    for (let expense of remainingExpenses) {
      let expenseCovered = false;
      for (let income of remainingIncomes) {
        if (income.amount > 0) {
          const coverAmount = Math.min(income.amount, expense.amount);
          result.push(`${expense.name} (${expense.amount}, дата: ${expense.date}) покрыто доходом от ${income.date} на ${coverAmount}`);
          income.amount -= coverAmount;
          expense.amount -= coverAmount;
          if (expense.amount <= 0) {
            expenseCovered = true;
            break;
          }
        }
      }
      if (!expenseCovered && expense.amount > 0) {
        result.push(`${expense.name} (дата: ${expense.date}) не полностью покрыто (осталось ${expense.amount})`);
      }
    }

    // Рассчитываем остаток доступных доходов (исключая использованное из кошелька)
    const totalRemainingAmount = remainingIncomes
      .filter(inc => inc.date !== 'Из кошелька') // Исключаем кошелек из остатка
      .reduce((sum, inc) => sum + inc.amount, 0);
    setTotalRemaining(totalRemainingAmount);

    setCalculation(result);

    // Вычитаем использованное из кошелька
    if (walletAmount > 0) {
      setWallet(prev => prev - walletAmount);
      setUseFromWallet(''); // Сбрасываем поле после использования
    }

    // Добавляем в историю с timestamp
    setHistory([...history, { timestamp: new Date().toISOString(), description: `Выполнен расчёт: использован кошелёк ${walletAmount.toFixed(2)} руб., остаток доходов: ${totalRemainingAmount.toFixed(2)} руб.` }]);
  };

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
           остаток от округления — в кошелек, <br />остальное (90%) доступно для расходов.</p>
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
          <button type="submit">Добавить расход</button>
        </form>
        <ul>
          {expenses.map((exp, idx) => (
            <li key={idx}>
              {exp.name} ({exp.date}): {exp.amount} руб. 
              <button onClick={() => handleDeleteExpense(idx)}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={calculate}>Рассчитать</button> {/* Исправил опечатку */}

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

      {/* Отдельная графа для остатка доходов */}
      {totalRemaining !== null && (
        <div>
          <h2>Остаток</h2>
          <p>После покрытия расходов: {totalRemaining.toFixed(2)} руб.</p>
        </div>
      )}

      {/* Раздел истории */}
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
