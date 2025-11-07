import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function Charts({ expenses }) {
  const data = expenses.reduce((acc, exp) => {
    const priority = exp.priority;
    acc[priority] = (acc[priority] || 0) + exp.amount;
    return acc;
  }, {});
  const chartData = Object.keys(data).map(key => ({ name: key, value: data[key] }));

  return (
    <div>
      <h2>График расходов по приоритетам</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#ff0000', '#ffa500', '#008000'][index % 3]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Charts;
