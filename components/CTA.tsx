import { Link } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'

const CTA = () => {
  return (
    <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers and streamline your courier operations today.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Create Account
            </Button>
          </Link>
        </div>
      </section>
  )
}

export default CTA