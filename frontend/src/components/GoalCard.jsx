import { useState } from 'react';

export default function GoalCard({ goal, onLogProgress, onRefresh }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    on_track: { bg: 'bg-green-100', text: 'text-green-700', label: 'В графике' },
    at_risk: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Риск' },
    behind: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отстаём' }
  };

  const totalCurrent = goal.plan?.reduce((sum, s) => sum + s.current, 0) || 0;
  const percent = goal.target > 0 ? Math.round((totalCurrent / goal.target) * 100) : 0;
  
  const daysTotal = Math.ceil(
    (new Date(goal.period_end) - new Date(goal.period_start)) / (1000 * 60 * 60 * 24)
  ) + 1;
  const daysElapsed = Math.max(0, Math.ceil(
    (new Date() - new Date(goal.period_start)) / (1000 * 60 * 60 * 24)
  ));
  const requiredPercent = Math.min(100, Math.round((daysElapsed / daysTotal) * 100));
  
  const status = percent >= requiredPercent * 0.85 ? 'on_track' 
    : percent >= requiredPercent * 0.65 ? 'at_risk' 
    : 'behind';
  
  const statusStyle = statusColors[status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
          {goal.type === 'time' ? '⏱' : '📊'}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{goal.title}</h3>
          
          <div className="flex items-center gap-3 mt-1">
            <span className={`px-2 py-0.5 rounded text-sm ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
            <span className="text-sm text-gray-500">
              Норма: {Math.round(goal.target * requiredPercent / 100)} {goal.unit}
            </span>
          </div>

          <div className="mt-3 relative">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${status === 'behind' ? 'bg-red-400' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
            <div 
              className="absolute top-0 w-0.5 h-4 bg-red-600"
              style={{ left: `${requiredPercent}%` }}
            />
            <div className="text-right text-sm text-gray-600 mt-1">
              {goal.target} ({percent}%)
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onLogProgress(goal)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>▶</span> Внести прогресс
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
      </div>

      {expanded && goal.plan && goal.plan.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Детализация</h4>
          <div className="grid grid-cols-2 gap-3">
            {goal.plan.map((sub) => (
              <div key={sub.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">{sub.title}</span>
                  <span className="text-sm text-gray-500">
                    {sub.current} / {sub.target}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(100, (sub.current / sub.target) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
