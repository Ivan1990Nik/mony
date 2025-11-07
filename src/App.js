import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import IncomeForm from './components/IncomeForm/IncomeForm';
import ExpenseForm from './components/ExpenseForm/ExpenseForm';
import IncomeList from './components/IncomeList/IncomeList';
import ExpenseList from './components/ExpenseList/ExpenseList';
import SavingsWallet from './components/SavingsWallet/SavingsWallet';
import Calculation from './components/Calculation/Calculation';
import History from './components/History/History';
import Charts from './components/Charts/Charts'; // Опционально, для графиков

function App() {
  // Все состояния
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [calculation, setCalculation] = useState(null);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeName, setIncomeName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expensePriority, setExpensePriority] = useState('Средний');
  const [useFromWallet, setUseFromWallet] = useState('');

  // Загрузка из localStorage
  useEffect(() => {
    const savedIncomes = JSON.parse(localStorage.getItem('incomes')) || [];
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const savedSavings = parseFloat(localStorage.getItem('savings')) || 0;
    const savedWallet = parseFloat(localStorage.getItem('wallet')) || 0;
    const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setIncomes(savedIncomes);
    setExpenses(savedExpenses);
    setSavings(savedSavings);
    setWallet(savedWallet);
    setHistory(savedHistory);
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('savings', savings.toString());
    localStorage.setItem('wallet', wallet.toString());
    localStorage.setItem('history', JSON.stringify(history));
  }, [incomes, expenses, savings, wallet, history]);

  // Функции
  const handleAddIncome = (e) => {
    e.preventDefault();

    const amount = parseFloat(incomeAmount);
    if (amount <= 0 || !incomeDate) return;

    const roundedAmount = Math.floor(amount / 1000) * 1000;
    const savingsPart = roundedAmount * 0.1;
    const walletPart = (amount - roundedAmount);
    const availablePart = roundedAmount * 0.9;

    setSavings(prev => prev + savingsPart);
    setWallet(prev => prev + walletPart);
    setIncomes(prev => [...prev, { date: incomeDate, amount: availablePart, name: incomeName }]);

    setHistory(prev => [...prev, { description: `Доход: ${availablePart.toFixed(2)} руб. (округлено, 10% в заначку, остаток в кошелёк)`, timestamp: Date.now() }]);

    setIncomeDate('');
    setIncomeAmount('');
    setIncomeName('');
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const amount = parseFloat(expenseAmount);
    if (amount <= 0 || !expenseName || !expenseDate) return;

    setExpenses(prev => [...prev, { name: expenseName, date: expenseDate, amount, priority: expensePriority }]);
    setHistory(prev => [...prev, { description: `Расход: ${expenseName} - ${amount.toFixed(2)} руб. (приоритет: ${expensePriority})`, timestamp: Date.now() }]);

    setExpenseName('');
    setExpenseAmount('');
    setExpenseDate('');
    setExpensePriority('Средний');
  };

  const handleDeleteIncome = (index) => {
    const income = incomes[index];
    setIncomes(prev => prev.filter((_, i) => i !== index));
    setHistory(prev => [...prev, { description: `Удалён доход: ${income.amount.toFixed(2)} руб. (${income.date})`, timestamp: Date.now() }]);
  };

  const handleDeleteExpense = (index) => {
    const expense = expenses[index];
    setExpenses(prev => prev.filter((_, i) => i !== index));
    setHistory(prev => [...prev, { description: `Удалён расход: ${expense.name} - ${expense.amount.toFixed(2)} руб. (${expense.date})`, timestamp: Date.now() }]);
  };

  const handleDeleteHistory = (index) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetSavings = () => {
    setSavings(0);
    setHistory(prev => [...prev, { description: 'Заначка сброшена', timestamp: Date.now() }]);
  };

  const handleResetWallet = () => {
    setWallet(0);
    setHistory(prev => [...prev, { description: 'Кошелёк сброшен', timestamp: Date.now() }]);
  };

  const calculate = () => {
  // Проверки (как раньше)
  const walletUsage = parseFloat(useFromWallet) || 0;
  if (walletUsage > wallet) {
    alert('Недостаточно средств в кошельке!');
    return;
  }

  // Собираем источники: кошелёк + доходы (сортированные по дате, старые сначала)
  const sources = [];
  let walletSource = null;  // Отдельный трек для кошелька

  if (walletUsage > 0) {
    walletSource = { name: 'Кошелёк', remaining: walletUsage, originalAmount: walletUsage, key: 'wallet' };
    sources.push(walletSource);
  }

  // Сортировка доходов по дате (старые сначала) + сохраняем ссылку на оригинал для обновления
  const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
  sortedIncomes.forEach((inc, index) => {
    const key = `${inc.name}-${inc.date}`;  // Уникальный ключ для матчинга
    sources.push({ 
      ...inc,  // Копируем свойства оригинала
      remaining: parseFloat(inc.amount),  // Парсим в число!
      originalAmount: parseFloat(inc.amount),  // Парсим в число!
      key: key,
      originalIndex: index  // Для обновления incomes по индексу
    });
  });

  // Сортировка расходов по приоритету + копия для обновления
  const sortedExpenses = [...expenses].sort((a, b) => {
    const priorities = { 'Высокий': 3, 'Средний': 2, 'Низкий': 1 };
    return priorities[b.priority] - priorities[a.priority];
  });

  const result = [];
  let totalDeficit = 0;
  let updatedExpenses = [...expenses];  // Копия для обновления состояния

  for (let i = 0; i < sortedExpenses.length; i++) {
    const exp = sortedExpenses[i];
    const expAmount = parseFloat(exp.amount);  // Парсим в число для точного сравнения!
    let expCovered = 0;
    const coverageDetails = [];

    for (const source of sources) {
      if (source.remaining > 0 && expCovered < expAmount) {
        const needed = expAmount - expCovered;
        const coverAmount = Math.min(needed, source.remaining);
        source.remaining -= coverAmount;
        expCovered += coverAmount;
        coverageDetails.push({ source: source.name, amount: coverAmount });
      }
    }

    // Обновляем расход в updatedExpenses (находим по name/date для матчинга)
    const expKey = `${exp.name}-${exp.date}`;
    const expIndex = updatedExpenses.findIndex(e => `${e.name}-${e.date}` === expKey);
    if (expIndex !== -1) {
      updatedExpenses[expIndex].amount = parseFloat(updatedExpenses[expIndex].amount) - expCovered;  // Парсим и уменьшаем
      if (updatedExpenses[expIndex].amount <= 0) {
        // Удаляем полностью покрытый расход
        updatedExpenses.splice(expIndex, 1);
        i--;  // Корректируем индекс
      }
    }

    // Формируем строку для result (теперь с парсингом expAmount)
    if (expCovered >= expAmount) {
      const detailsStr = coverageDetails.map(d => `${d.source}: ${d.amount.toFixed(2)} руб.`).join(', ');
      result.push(`${exp.name} (${exp.date}): полностью покрыт (${detailsStr})`);
    } else {
      const shortfall = expAmount - expCovered;
      const detailsStr = coverageDetails.map(d => `${d.source}: ${d.amount.toFixed(2)} руб.`).join(', ');
      result.push(`${exp.name} (${exp.date}): покрыт частично (${detailsStr}) (не хватает ${shortfall.toFixed(2)} руб.)`);
      totalDeficit += shortfall;
    }
  }

  // Обновляем доходы в состоянии (уменьшаем на использованное)
  let updatedIncomes = [...incomes];
  sources.forEach(source => {
    if (source.key !== 'wallet') {  // Пропускаем кошелёк
      const usedAmount = source.originalAmount - source.remaining;
      const incomeIndex = updatedIncomes.findIndex(inc => 
        `${inc.name}-${inc.date}` === source.key
      );
      if (incomeIndex !== -1 && usedAmount > 0) {
        updatedIncomes[incomeIndex].amount = parseFloat(updatedIncomes[incomeIndex].amount) - usedAmount;  // Парсим и уменьшаем
        if (updatedIncomes[incomeIndex].amount <= 0) {
          updatedIncomes.splice(incomeIndex, 1);  // Удаляем полностью использованный доход
        }
      }
    }
  });
  setIncomes(updatedIncomes);  // Обновляем состояние доходов

  // Обновляем расходы
  setExpenses(updatedExpenses);

  // Обновляем кошелёк: вычитаем реально использованное
  let walletUsed = 0;
  if (walletSource) {
    walletUsed = walletSource.originalAmount - walletSource.remaining;
  }
  setWallet(prev => prev - walletUsed);

  // Общий остаток (как раньше)
  const totalRemaining = sources.reduce((sum, src) => sum + src.remaining, 0);
  setTotalRemaining(totalRemaining);

  // Добавляем общий дефицит в result
  if (totalDeficit > 0) {
    result.push(`Общий дефицит: ${totalDeficit.toFixed(2)} руб.`);
  }

  setCalculation(result);
  setHistory(prev => [...prev, { 
    description: totalRemaining >= 0 
      ? `Расчёт выполнен. Остаток: ${totalRemaining.toFixed(2)} руб.` 
      : `Расчёт выполнен. Дефицит: ${(-totalRemaining).toFixed(2)} руб.`, 
    timestamp: Date.now() 
  }]);
};


  return (
    <div className="App">
      <Header />
      <SavingsWallet
        savings={savings}
        wallet={wallet}
        useFromWallet={useFromWallet}
        setUseFromWallet={setUseFromWallet}
        onResetSavings={handleResetSavings}
        onResetWallet={handleResetWallet}
      />
      <IncomeForm
        incomeDate={incomeDate}
        incomeName={incomeName}
        setIncomeDate={setIncomeDate}
        incomeAmount={incomeAmount}
        setIncomeAmount={setIncomeAmount}
        setIncomeName={setIncomeName}
        onAddIncome={handleAddIncome}
      />
      <IncomeList incomes={incomes} onDeleteIncome={handleDeleteIncome} />
      <ExpenseForm
        expenseName={expenseName}
        setExpenseName={setExpenseName}
        expenseDate={expenseDate}
        setExpenseDate={setExpenseDate}
        expenseAmount={expenseAmount}
        setExpenseAmount={setExpenseAmount}
        expensePriority={expensePriority}
        setExpensePriority={setExpensePriority}
        onAddExpense={handleAddExpense}
      />
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
      <Calculation
        incomes={incomes}  // Добавлено
        expenses={expenses}  // Добавлено
        onCalculate={calculate}
        calculation={calculation}
        totalRemaining={totalRemaining}
      />
      <History
        history={history}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        onDeleteHistory={handleDeleteHistory}
      />
      <Charts incomes={incomes} expenses={expenses} />
    </div>
  );
}

export default App;
