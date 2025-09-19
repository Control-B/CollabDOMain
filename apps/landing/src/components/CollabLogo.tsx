export default function CollabLogo({
  className = 'w-8 h-8',
  title = 'Dispatchar',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">D</span>
      </div>
    </div>
  );
}
