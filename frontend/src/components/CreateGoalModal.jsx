import { useState } from 'react';
import { createGoal } from '../api/goals';

export default function CreateGoalModal({ userId, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('time');
  const [subgoals, setSubgoals] = useState([{ title: '', target: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSubgoal = () => {
    setSubgoals([...subgoals, { title: '', target: '' }]);
  };

  const removeSubgoal = (index) => {
    if (subgoals.length > 1) {
      setSubgoals(subgoals.filter((_, i) => i !== index));
    }
  };

  const updateSubgoal = (index, field, value) => {
    const updated = [...subgoals];
    updated[index][field] = value;
    setSubgoals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Введите название цели');
      return;
    }

    const validSubgoals = subgoals.filter(s => s.title.trim() && s.target);
    if (validSubgoals.length === 0) {
      setError('Добавьте хотя бы одну подзадачу');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createGoal({
        user_id: userId,
        title: title.trim(),
        type: type,
        subgoals: validSubgoals.map(s => ({
          title: s.title.trim(),
          target: parseFloat(s.target)
        }))
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
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Новая цель</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Изучить Python"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Тип цели</label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setType('time')}
                className={`flex-1 py-2 ${type === 'time' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                Время (минуты)
              </button>
              <button
                type="button"
                onClick={() => setType('count')}
                className={`flex-1 py-2 ${type === 'count' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                Количество
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-600">Подзадачи</label>
              <button
                type="button"
                onClick={addSubgoal}
                className="text-blue-500 text-sm hover:underline"
              >
                + Добавить
              </button>
            </div>

            <div className="space-y-2">
              {subgoals.map((sub, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => updateSubgoal(index, 'title', e.target.value)}
                    placeholder="Название задачи"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    value={sub.target}
                    onChange={(e) => updateSubgoal(index, 'target', e.target.value)}
                    placeholder={type === 'time' ? 'Мин' : 'Кол-во'}
                    className="w-24 border border-gray-300 rounded-lg px-3 py-2"
                    min="1"
                  />
                  {subgoals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubgoal(index)}
                      className="text-red-400 hover:text-red-600 px-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
