'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Kasun Perera',
    role: 'Graphic Designer',
    content: 'Best service ever! Got my Canva Pro account within 10 minutes. Very affordable and reliable. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Nimali Silva',
    role: 'Content Creator',
    content: 'Amazing experience! The ChatGPT Plus subscription is working perfectly. Customer support is excellent and very responsive.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ravindu Fernando',
    role: 'Student',
    content: 'Great prices and fast delivery! I got my Netflix account instantly after payment verification. Will definitely buy again.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Tharushi Jayasinghe',
    role: 'Entrepreneur',
    content: 'Very professional service. The accounts are genuine and work perfectly. Best place to get premium subscriptions in Sri Lanka!',
    rating: 5,
  },
]

export const Testimonials: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <section className={cn("py-20 lg:py-32 bg-neutral-50", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-200 mb-4">
            <Star className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Testimonials</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their premium subscriptions
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              variant="glass"
              className="group border-2 border-neutral-200 hover:border-primary-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/50 transition-all duration-500" />
              
              <CardContent className="p-6 relative">
                {/* Quote Icon */}
                <div className="mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Quote className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                        i < testimonial.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-neutral-300"
                      )}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-neutral-700 leading-relaxed mb-6 group-hover:text-neutral-800 transition-colors">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-semibold text-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral-900 mb-2">
              1000+
            </div>
            <div className="text-sm text-neutral-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral-900 mb-2">
              4.9/5
            </div>
            <div className="text-sm text-neutral-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral-900 mb-2">
              98%
            </div>
            <div className="text-sm text-neutral-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral-900 mb-2">
              24/7
            </div>
            <div className="text-sm text-neutral-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  )
}
