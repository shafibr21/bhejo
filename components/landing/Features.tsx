import { Truck, MapPin, Shield, Clock, Users, Package } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description: "Track your parcels in real-time with GPS integration and live updates",
    gradientFrom: "from-blue-600/20",
    gradientTo: "to-purple-600/20",
    iconColor: "text-blue-400",
    shadowColor: "shadow-blue-500/10",
  },
  {
    icon: Truck,
    title: "Optimized Routes",
    description: "AI-powered route optimization for faster deliveries and reduced costs",
    gradientFrom: "from-purple-600/20",
    gradientTo: "to-cyan-600/20",
    iconColor: "text-purple-400",
    shadowColor: "shadow-purple-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "End-to-end security with QR codes and digital signatures",
    gradientFrom: "from-cyan-600/20",
    gradientTo: "to-blue-600/20",
    iconColor: "text-cyan-400",
    shadowColor: "shadow-cyan-500/10",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock customer support and automated notifications",
    gradientFrom: "from-green-600/20",
    gradientTo: "to-emerald-600/20",
    iconColor: "text-green-400",
    shadowColor: "shadow-green-500/10",
  },
  {
    icon: Users,
    title: "Multi-role Access",
    description: "Separate dashboards for customers, agents, and administrators",
    gradientFrom: "from-orange-600/20",
    gradientTo: "to-red-600/20",
    iconColor: "text-orange-400",
    shadowColor: "shadow-orange-500/10",
  },
  {
    icon: Package,
    title: "Easy Booking",
    description: "Simple parcel booking with COD and prepaid options",
    gradientFrom: "from-indigo-600/20",
    gradientTo: "to-purple-600/20",
    iconColor: "text-indigo-400",
    shadowColor: "shadow-indigo-500/10",
  },
];

export default function Features() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent mb-6">
            Why Choose Bhejo?
          </h2>
          <p className="text-xl text-slate-400">
            Everything you need to manage your courier operations efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
