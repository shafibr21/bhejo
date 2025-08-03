import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8">
          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Fast, Reliable
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Courier Services
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
          Track your parcels in real-time, manage deliveries efficiently, and
          provide exceptional customer service with our comprehensive courier
          management system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
          <Link href="/register">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-blue-500/25 text-base sm:text-lg w-full sm:w-auto">
              Book a Parcel
            </button>
          </Link>
          <Link href="/tracking">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 text-slate-200 hover:text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm text-base sm:text-lg w-full sm:w-auto">
              Track Package
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
