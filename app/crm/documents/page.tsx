export default function DocumentsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Документы</h1>
        <p className="text-gray-500 mb-4">Хранение и управление документами</p>
        <span className="inline-block bg-amber-100 text-amber-700 text-sm px-4 py-2 rounded-full font-medium">
          Скоро будет доступно
        </span>
      </div>
    </div>
  );
}
