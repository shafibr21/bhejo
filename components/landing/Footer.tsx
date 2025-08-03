import { Package } from "lucide-react";

const footerSections = [
  {
    title: "Services",
    links: ["Parcel Delivery", "Express Shipping", "COD Services", "Bulk Orders"],
  },
  {
    title: "Support",
    links: ["Help Center", "Track Package", "Contact Us", "API Documentation"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 backdrop-blur-sm bg-slate-900/50 border-t border-slate-700/50 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-full blur animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                  <Package className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                Bhejo
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Professional courier management system for modern logistics.
            </p>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-6 text-slate-200">{section.title}</h3>
              <ul className="space-y-3 text-slate-400">
                {section.links.map((link, linkIndex) => (
                  <li
                    key={linkIndex}
                    className="hover:text-slate-300 transition-colors duration-200 cursor-pointer"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-700/50 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Bhejo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
