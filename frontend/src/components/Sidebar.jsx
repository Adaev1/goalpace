import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-100 text-blue-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 p-4 min-h-screen">
      <h1 className="text-xl font-bold text-gray-800 mb-6 px-2">GoalPace</h1>
      <nav className="space-y-1">
        <NavLink to="/" className={linkClass}>
          Дашборд
        </NavLink>
        <NavLink to="/analytics" className={linkClass}>
          Аналитика
        </NavLink>
      </nav>
    </aside>
  );
}
