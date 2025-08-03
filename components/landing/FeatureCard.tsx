import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  shadowColor: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconColor,
  shadowColor,
}: FeatureCardProps) {
  return (
    <div className="relative group">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
      ></div>
      <div
        className={`relative backdrop-blur-sm bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl hover:${shadowColor} transition-all duration-300`}
      >
        <div className="mb-4 sm:mb-6">
          <div className="relative inline-block">
            <div
              className={`absolute -inset-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full blur animate-pulse`}
            ></div>
            <div
              className={`relative bg-gradient-to-r ${gradientFrom} ${gradientTo} p-2.5 sm:p-3 rounded-full border border-opacity-30`}
            >
              <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor}`} />
            </div>
          </div>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-slate-100 mb-3 sm:mb-4">
          {title}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
