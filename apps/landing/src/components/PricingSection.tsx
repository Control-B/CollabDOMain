'use client'

import { Check, Star, Zap } from 'lucide-react'

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "per vehicle/month",
      description: "Perfect for small fleets getting started",
      features: [
        "Up to 10 vehicles",
        "Basic geofence check-ins",
        "Document management",
        "Team messaging",
        "Mobile app access",
        "Email support"
      ],
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$49",
      period: "per vehicle/month",
      description: "Ideal for growing trucking companies",
      features: [
        "Up to 100 vehicles",
        "Advanced geofence zones",
        "Digital signatures",
        "Real-time tracking",
        "Compliance reporting",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      popular: true,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large operations with complex needs",
      features: [
        "Unlimited vehicles",
        "Custom geofence rules",
        "Advanced analytics",
        "White-label options",
        "Dedicated support",
        "Custom development",
        "SLA guarantees",
        "On-premise deployment"
      ],
      popular: false,
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your fleet size and needs. 
            All plans include our core features with no hidden fees or setup costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-2xl transform scale-105' 
                  : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">14-Day Free Trial</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Try Dispatch risk-free for 14 days. No credit card required. 
              Cancel anytime with no questions asked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold">
                Start Free Trial
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
