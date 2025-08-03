export default function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-600/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Additional mobile-optimized background elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 rounded-full blur-2xl animate-pulse delay-700"></div>
    </div>
  );
}
