import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>
      </div>
      <div className="relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/50 rounded-2xl sm:rounded-3xl mx-4 sm:mx-8 lg:mx-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-4 sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0">
            Join thousands of satisfied customers and streamline your courier
            operations today.
          </p>
          <Link href="/register">
            <button className="px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-blue-500/25 text-base sm:text-lg w-full sm:w-auto max-w-xs sm:max-w-none">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
