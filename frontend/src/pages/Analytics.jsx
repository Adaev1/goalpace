export default function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Аналитика</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">Всего целей</div>
          <div className="text-3xl font-bold mt-1">—</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">Выполнено</div>
          <div className="text-3xl font-bold mt-1 text-green-500">—</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-gray-500 text-sm">В процессе</div>
          <div className="text-3xl font-bold mt-1 text-blue-500">—</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">График активности</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          Здесь будет график
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">История логов</h2>
        <div className="text-center py-8 text-gray-400">
          Функционал в разработке
        </div>
      </div>
    </div>
  );
}
