import { Package } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-blue-400" />
                <span className="ml-2 text-lg font-bold">CourierPro</span>
              </div>
              <p className="text-gray-400">Professional courier management system for modern logistics.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Parcel Delivery</li>
                <li>Express Shipping</li>
                <li>COD Services</li>
                <li>Bulk Orders</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Track Package</li>
                <li>Contact Us</li>
                <li>API Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CourierPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer