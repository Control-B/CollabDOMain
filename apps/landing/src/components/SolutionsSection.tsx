'use client'

import { Truck, Building2, Package, Users2, Clock, DollarSign } from 'lucide-react'

export default function SolutionsSection() {
  const solutions = [
    {
      icon: Truck,
      title: "Fleet Management",
      description: "Complete visibility and control over your entire fleet. Track vehicles, monitor driver performance, and optimize routes in real-time.",
      stats: "Reduce fuel costs by 15%",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Building2,
      title: "Terminal Operations",
      description: "Streamline terminal operations with automated check-ins, digital paperwork, and instant communication between drivers and staff.",
      stats: "Eliminate 90% of paperwork",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Package,
      title: "Delivery Tracking",
      description: "Provide customers with real-time delivery updates. Automated notifications and proof of delivery with photo capture.",
      stats: "Improve customer satisfaction by 40%",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users2,
      title: "Driver Communication",
      description: "Keep your drivers connected with instant messaging, emergency alerts, and important updates from dispatch.",
      stats: "Reduce communication delays by 80%",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Clock,
      title: "Compliance & Safety",
      description: "Automated hours of service tracking, maintenance reminders, and safety compliance reporting to keep you DOT compliant.",
      stats: "Zero compliance violations",
      color: "from-red-500 to-red-600"
    },
    {
      icon: DollarSign,
      title: "Cost Optimization",
      description: "Reduce operational costs with route optimization, fuel tracking, and automated expense management.",
      stats: "Save $50K+ annually",
      color: "from-teal-500 to-teal-600"
    }
  ]

  return (
    <section id="solutions" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solutions for Every
            <span className="gradient-text"> Challenge</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're managing a small fleet or a large logistics operation, 
            Dispatch provides tailored solutions to address your specific needs and challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${solution.color}`}></div>
              
              <div className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {solution.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {solution.description}
                </p>
                
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${solution.color} text-white text-sm font-medium`}>
                  {solution.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Operations?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of trucking companies that have already revolutionized their operations with Dispatch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold">
                Schedule Demo
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold">
                View Case Studies
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
