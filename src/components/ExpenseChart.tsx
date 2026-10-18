import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type Transaction } from '../types';

type ExpenseChartProps = {
  transactions: Transaction[];
};

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center h-[340px] border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 w-full text-left">Grafik Pengeluaran</h2>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-sm">Belum ada data pengeluaran di periode ini.</p>
        </div>
      </div>
    );
  }

  const groupedData = expenses.reduce((acc, curr) => {
    const category = curr.category || 'Lainnya';
    acc[category] = (acc[category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(groupedData)
    .map(key => ({
      name: key,
      value: groupedData[key]
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
          <p className="font-semibold text-gray-700">{payload[0].name}</p>
          <p className="text-red-500 font-medium">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Analisis Pengeluaran</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70} 
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}