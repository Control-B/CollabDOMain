export default function CollabLogo({
  className = 'w-8 h-8',
  title = 'Dispatchar',
}: {
  className?: string;
  title?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-10 h-10">
        {/* Main chat bubble */}
        <div className="absolute top-1 left-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>

        {/* Secondary chat bubble */}
        <div className="absolute top-3 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <div
            className="w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>

        {/* Third chat bubble */}
        <div className="absolute bottom-1 left-3 w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
          <div
            className="w-1 h-1 bg-white rounded-full animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Connection lines */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
        <div
          className="absolute top-4 right-2 w-0.5 h-0.5 bg-green-300 rounded-full animate-ping"
          style={{ animationDelay: '0.3s' }}
        ></div>
        <div
          className="absolute bottom-2 left-4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-ping"
          style={{ animationDelay: '0.7s' }}
        ></div>
      </div>
    </div>
  );
}
