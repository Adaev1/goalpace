import { useState } from 'react';
import { updateGoal } from '../api/goals';

export default function EditGoalModal({ goal, onClose, onSuccess }) {
  const emojiOptions = ['🎯', '📚', '💻', '🏃', '🧠', '📝', '🔥', '🚀', '💡', '🏆'];
  
  const titleString = goal?.title || '';
  const parsedTitle = titleString.match(/^(\p{Extended_Pictographic})\s*(.*)$/u);
  const initialEmoji = parsedTitle ? parsedTitle[1] : '🎯';
  const initialTitle = parsedTitle ? parsedTitle[2] : titleString;

  const [title, setTitle] = useState(initialTitle);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [periodEnd, setPeriodEnd] = useState(goal.period_end);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Введите название цели');
      return;
    }

    if (goal.period_start > periodEnd) {
      setError('Дата окончания должна быть позже даты начала');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateGoal(goal.id, {
        title: `${emoji} ${title.trim()}`,
        period_end: periodEnd
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Редактировать цель</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Эмодзи цели</label>
            <div className="flex flex-wrap gap-2">
              {emojiOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmoji(item)}
                  className={`w-10 h-10 rounded-lg border text-xl ${
                    emoji === item
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Дата окончания</label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
