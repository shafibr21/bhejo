import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Fast, Reliable
            <span className="text-blue-600"> Courier Services</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your parcels in real-time, manage deliveries efficiently, and provide exceptional customer service
            with our comprehensive courier management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Book a Parcel
              </Button>
            </Link>
            <Link href="/tracking">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Track Package
              </Button>
            </Link>
          </div>
        </div>
      </section>
  )
}

export default Hero