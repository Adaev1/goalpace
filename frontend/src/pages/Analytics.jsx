import { useEffect, useMemo, useState } from 'react';
import {
  fetchMonthReport,
  fetchOverallSummary,
  getOrCreateUser
} from '../api/goals';

function formatDateLabel(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function formatMonthInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(formatMonthInput(new Date()));

  useEffect(() => {
    loadAnalytics(selectedMonth);
  }, [selectedMonth]);

  const loadAnalytics = async (monthValue) => {
    setLoading(true);
    setError('');

    try {
      const user = await getOrCreateUser('demo@example.com');
      const [year, month] = monthValue.split('-').map(Number);

      const [summaryData, monthData] = await Promise.all([
        fetchOverallSummary(user.id),
        fetchMonthReport(user.id, year, month)
      ]);

      setSummary(summaryData);
      setDays(monthData.days ?? []);
    } catch (err) {
      setError('Не удалось загрузить аналитику. Проверь, что backend запущен.');
      console.error('Ошибка загрузки аналитики:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxHours = useMemo(() => {
    if (!days.length) return 1;
    return Math.max(...days.map((day) => day.total_hours), 1);
  }, [days]);

  const recentDays = useMemo(() => {
    return [...days]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
  }, [days]);

  const warningCount = summary ? summary.at_risk + summary.behind : 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="month" className="text-sm text-gray-600">Месяц:</label>
          <input
            id="month"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">Всего целей</div>
          <div className="text-3xl font-bold mt-1">
            {loading ? '—' : (summary?.total_goals ?? 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">По плану</div>
          <div className="text-3xl font-bold mt-1 text-green-500">
            {loading ? '—' : (summary?.on_track ?? 0)}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">Требуют внимания</div>
          <div className="text-3xl font-bold mt-1 text-amber-500">
            {loading ? '—' : warningCount}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Активность по дням (часы)</h2>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">Загрузка...</div>
        ) : days.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            За выбранный месяц нет логов
          </div>
        ) : (
          <div className="h-64 flex items-end gap-2 overflow-x-auto pb-3">
            {days.map((day) => {
              const heightPercent = Math.max((day.total_hours / maxHours) * 100, 4);
              return (
                <div key={day.date} className="min-w-8.5 flex flex-col items-center justify-end gap-2">
                  <div
                    className="w-7 bg-blue-500 rounded-t-md transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${formatDateLabel(day.date)}: ${day.total_hours} ч.`}
                  />
                  <span className="text-[11px] text-gray-500 rotate-[-35deg] origin-top-left">
                    {formatDateLabel(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Последняя активность</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Загрузка...</div>
        ) : recentDays.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Записей пока нет</div>
        ) : (
          <div className="space-y-3">
            {recentDays.map((day) => (
              <div
                key={day.date}
                className="border border-gray-100 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
              >
                <div className="font-medium">{new Date(day.date).toLocaleDateString('ru-RU')}</div>
                <div className="text-sm text-gray-600">Часы: {day.total_hours}</div>
                <div className="text-sm text-gray-600">Счётчик: {day.total_count}</div>
                <div className="text-sm text-gray-600">Активных целей: {day.goals_active}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
