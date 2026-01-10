const API_URL = '/api';

export async function fetchGoals(userId) {
  const res = await fetch(`${API_URL}/goals/?user_id=${userId}`);
  if (!res.ok) throw new Error('Ошибка загрузки целей');
  return res.json();
}

export async function createGoal(userId, goalData) {
  const res = await fetch(`${API_URL}/goals/?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goalData)
  });
  if (!res.ok) throw new Error('Ошибка создания цели');
  return res.json();
}

export async function deleteGoal(goalId) {
  const res = await fetch(`${API_URL}/goals/${goalId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Ошибка удаления цели');
}

export async function createLog(logData) {
  const res = await fetch(`${API_URL}/logs/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  });
  if (!res.ok) throw new Error('Ошибка сохранения прогресса');
  return res.json();
}

export async function getOrCreateUser(email) {
  const res = await fetch(`${API_URL}/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, tz: 'Europe/Moscow' })
  });
  if (!res.ok) throw new Error('Ошибка авторизации');
  return res.json();
}
