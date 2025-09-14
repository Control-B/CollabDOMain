export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
        <p className="text-gray-700 mb-4">If you can see blue background and styled text, Tailwind is working!</p>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
          Test Button
        </button>
      </div>
    </div>
  );
}
