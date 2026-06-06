import { priorityClass, formatCurrency } from '../../utils/helpers';
import { TrendingUp } from 'lucide-react';

export default function InvestmentRankingTable({ data = [] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Investment Ranking — Top 10</h3>
        <TrendingUp size={18} className="text-ev-blue" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ev-gray text-xs uppercase border-b border-ev-dark-border">
              <th className="text-left pb-2">#</th>
              <th className="text-left pb-2">Location</th>
              <th className="text-right pb-2">Demand</th>
              <th className="text-right pb-2">Invest.</th>
              <th className="text-right pb-2">ROI</th>
              <th className="text-right pb-2">Cost</th>
              <th className="text-right pb-2">Payback</th>
              <th className="text-center pb-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-ev-dark-border/50 hover:bg-ev-dark-border/20 transition-colors">
                <td className="py-2.5 text-ev-gray font-mono">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-2.5">
                  <p className="text-white font-medium">{row.name}</p>
                  <p className="text-ev-gray text-xs">{row.city}</p>
                </td>
                <td className="py-2.5 text-right font-mono text-white">{row.demandScore}</td>
                <td className="py-2.5 text-right font-mono text-ev-blue">{row.investmentScore}</td>
                <td className="py-2.5 text-right font-mono text-green-400">{row.estimatedROI}%</td>
                <td className="py-2.5 text-right text-ev-gray">{formatCurrency(row.estimatedCost)}</td>
                <td className="py-2.5 text-right text-ev-gray">{row.paybackPeriodMonths}mo</td>
                <td className="py-2.5 text-center">
                  <span className={priorityClass(row.priority)}>{row.priority}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
