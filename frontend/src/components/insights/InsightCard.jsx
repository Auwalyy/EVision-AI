import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { priorityClass, scoreColor } from '../../utils/helpers';

const riskIcon = { Low: CheckCircle, Medium: TrendingUp, High: AlertTriangle };
const riskColor = { Low: 'text-green-400', Medium: 'text-yellow-400', High: 'text-red-400' };

export default function InsightCard({ insight }) {
  const RiskIcon = riskIcon[insight.riskLevel] || CheckCircle;

  return (
    <div className="card hover:border-ev-blue/30 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white font-semibold">{insight.location}</p>
            <span className={priorityClass(insight.priority)}>{insight.priority}</span>
          </div>
          <p className="text-ev-gray text-xs mb-3">{insight.city}</p>
          <p className="text-slate-300 text-sm leading-relaxed italic">"{insight.insight}"</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div
            className="w-14 h-14 rounded-full border-4 flex items-center justify-center text-white font-bold text-lg"
            style={{ borderColor: scoreColor(insight.demandScore) }}
          >
            {insight.demandScore}
          </div>
          <p className="text-ev-gray text-xs">Demand</p>
        </div>
      </div>
      <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t border-ev-dark-border text-xs ${riskColor[insight.riskLevel]}`}>
        <RiskIcon size={13} />
        <span>{insight.riskLevel} Risk</span>
        {insight.priority && (
          <span className="ml-auto text-ev-gray/60">{insight.priority} Priority</span>
        )}
      </div>
    </div>
  );
}
