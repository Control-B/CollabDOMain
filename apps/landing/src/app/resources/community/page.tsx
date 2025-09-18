'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Truck,
  Package,
  Headphones,
  MessageSquare,
  Heart,
  Star,
  Calendar,
  MapPin,
  Clock,
  TrendingUp,
  Award,
  Coffee,
  Handshake,
  Target,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Building,
  Video,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CommunityPage() {
  const communities = [
    {
      title: 'Trucking Community',
      description:
        'Connect with drivers, owner-operators, and trucking professionals',
      icon: Truck,
      color: 'from-blue-600 to-cyan-600',
      members: '15,000+',
      posts: '2,400',
      features: [
        'Driver forums and discussions',
        'Route sharing and tips',
        'Maintenance advice',
        'Industry news and updates',
        'Driver appreciation events',
        'Safety best practices',
      ],
      testimonials: [
        {
          name: 'Mike Rodriguez',
          role: 'Owner-Operator, 12 years',
          quote:
            'This community has been a game-changer. The support from fellow drivers is incredible.',
          avatar: '/avatars/mike-r.jpg',
        },
        {
          name: 'Sarah Chen',
          role: 'Long-haul Driver, 8 years',
          quote:
            'Found the best routes and made lifelong friends here. Highly recommend!',
          avatar: '/avatars/sarah-c.jpg',
        },
      ],
      topics: [
        { name: 'Route Optimization', posts: 456, replies: 2301 },
        { name: 'Equipment & Maintenance', posts: 389, replies: 1895 },
        { name: 'Regulations & Compliance', posts: 267, replies: 1456 },
        { name: 'Driver Wellness', posts: 234, replies: 1123 },
      ],
    },
    {
      title: 'Warehouse Community',
      description:
        'Hub for warehouse managers, supervisors, and logistics coordinators',
      icon: Package,
      color: 'from-green-600 to-emerald-600',
      members: '8,500+',
      posts: '1,800',
      features: [
        'Inventory management strategies',
        'Automation discussions',
        'Safety protocols',
        'Efficiency optimization',
        'Technology integration',
        'Staff training resources',
      ],
      testimonials: [
        {
          name: 'David Kim',
          role: 'Warehouse Manager, 15 years',
          quote:
            'The automation insights shared here helped us increase efficiency by 40%.',
          avatar: '/avatars/david-k.jpg',
        },
        {
          name: 'Lisa Thompson',
          role: 'Operations Supervisor, 7 years',
          quote:
            'Great community for solving complex logistics challenges together.',
          avatar: '/avatars/lisa-t.jpg',
        },
      ],
      topics: [
        { name: 'Warehouse Automation', posts: 312, replies: 1567 },
        { name: 'Inventory Optimization', posts: 298, replies: 1432 },
        { name: 'Safety Procedures', posts: 245, replies: 1234 },
        { name: 'Staff Management', posts: 187, replies: 956 },
      ],
    },
    {
      title: 'Dispatch & Admin Community',
      description:
        'For dispatchers, fleet managers, and administrative professionals',
      icon: Headphones,
      color: 'from-purple-600 to-indigo-600',
      members: '12,000+',
      posts: '3,100',
      features: [
        'Dispatch best practices',
        'Fleet management strategies',
        'Driver communication tips',
        'Technology solutions',
        'Compliance management',
        'Cost optimization techniques',
      ],
      testimonials: [
        {
          name: 'Jennifer Walsh',
          role: 'Fleet Manager, 10 years',
          quote:
            'The strategic insights from other managers have transformed our operations.',
          avatar: '/avatars/jennifer-w.jpg',
        },
        {
          name: 'Carlos Martinez',
          role: 'Senior Dispatcher, 6 years',
          quote:
            'Best place to learn new dispatch techniques and share experiences.',
          avatar: '/avatars/carlos-m.jpg',
        },
      ],
      topics: [
        { name: 'Route Planning', posts: 567, replies: 2890 },
        { name: 'Driver Relations', posts: 445, replies: 2234 },
        { name: 'Technology Integration', posts: 356, replies: 1789 },
        { name: 'Cost Management', posts: 289, replies: 1456 },
      ],
    },
  ];

  const communityStats = [
    { label: 'Active Members', value: '35,000+', icon: Users },
    { label: 'Daily Discussions', value: '500+', icon: MessageSquare },
    { label: 'Solutions Shared', value: '10,000+', icon: Zap },
    { label: 'Success Stories', value: '2,500+', icon: Star },
  ];

  const communityTypes = [
    {
      title: 'Text Communities',
      description:
        'Join discussion forums and chat channels for real-time conversations',
      icon: MessageSquare,
      color: 'from-blue-600 to-cyan-600',
      features: [
        'Discussion forums by topic',
        'Real-time chat channels',
        'Direct messaging',
        'Rich text formatting',
        'File sharing and attachments',
        'Thread-based conversations',
      ],
      examples: [
        'Driver Chat Rooms',
        'Dispatch Forums',
        'Technical Support',
        'Industry News Discussions',
      ],
    },
    {
      title: 'Voice Communities',
      description: 'Participate in voice channels and audio discussions',
      icon: Headphones,
      color: 'from-green-600 to-emerald-600',
      features: [
        'Voice chat rooms',
        'Push-to-talk channels',
        'Audio quality controls',
        'Voice recording and playback',
        'Background noise suppression',
        'Multi-participant conversations',
      ],
      examples: [
        'Daily Dispatch Calls',
        'Driver Check-ins',
        'Training Sessions',
        'Q&A Sessions',
      ],
    },
    {
      title: 'Video Communities',
      description: 'Connect face-to-face through video calls and meetings',
      icon: Video,
      color: 'from-purple-600 to-indigo-600',
      features: [
        'HD video calls',
        'Screen sharing',
        'Virtual backgrounds',
        'Recording capabilities',
        'Breakout rooms',
        'Interactive whiteboards',
      ],
      examples: [
        'Virtual Team Meetings',
        'Training Demonstrations',
        'Equipment Walkthroughs',
        'Safety Briefings',
      ],
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Peer Support',
      description:
        'Get help from experienced professionals who understand your challenges',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description:
        'Access career opportunities, mentorship, and professional development',
    },
    {
      icon: Zap,
      title: 'Knowledge Sharing',
      description:
        'Learn best practices, tips, and innovative solutions from the community',
    },
    {
      icon: Award,
      title: 'Recognition',
      description:
        'Get recognized for your contributions and achievements in the industry',
    },
    {
      icon: Coffee,
      title: 'Networking',
      description:
        'Build meaningful professional relationships and expand your network',
    },
    {
      icon: Shield,
      title: 'Industry Insights',
      description:
        'Stay updated with the latest trends, regulations, and market changes',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-100">
      <Navigation />

      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Community
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Join the
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {' '}
                Logistics Community
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Connect with thousands of logistics professionals across trucking,
              warehousing, and dispatch operations. Share experiences, learn
              from experts, and grow together in our supportive community.
            </p>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {communityStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Community
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Each community is tailored to specific roles in the logistics
              industry, providing relevant discussions, resources, and
              networking opportunities.
            </p>
          </div>

          <div className="space-y-16">
            {communities.map((community, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
              >
                <div className="p-8">
                  {/* Community Header */}
                  <div className="flex items-center mb-8">
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-r ${community.color} shadow-lg mr-6`}
                    >
                      <community.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {community.title}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {community.description}
                      </p>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-blue-400 font-medium">
                            {community.members} members
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-green-400 font-medium">
                            {community.posts} monthly posts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Community Features
                      </h4>
                      <ul className="space-y-3">
                        {community.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Popular Topics */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Popular Topics
                      </h4>
                      <div className="space-y-3">
                        {community.topics.map((topic, topicIndex) => (
                          <div
                            key={topicIndex}
                            className="bg-gray-700/30 rounded-lg p-4"
                          >
                            <h5 className="font-medium text-white mb-2">
                              {topic.name}
                            </h5>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <span>{topic.posts} posts</span>
                              <span>{topic.replies} replies</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonials */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        Member Stories
                      </h4>
                      <div className="space-y-4">
                        {community.testimonials.map(
                          (testimonial, testimonialIndex) => (
                            <div
                              key={testimonialIndex}
                              className="bg-gray-700/30 rounded-lg p-4"
                            >
                              <p className="text-gray-300 text-sm mb-3 italic">
                                "{testimonial.quote}"
                              </p>
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                  <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-white text-sm">
                                    {testimonial.name}
                                  </div>
                                  <div className="text-gray-400 text-xs">
                                    {testimonial.role}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-center">
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                    >
                      Join {community.title}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Join Our Community?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Being part of our logistics community offers numerous benefits
              that can accelerate your career and improve your daily operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Communication Style
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join existing communities or create your own using text, voice, or
              video communication. Connect in the way that works best for you
              and your team.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {communityTypes.map((type, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-8"
              >
                <div className="text-center mb-8">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-r ${type.color} shadow-lg mx-auto mb-6`}
                  >
                    <type.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {type.title}
                  </h3>
                  <p className="text-gray-400">{type.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Features
                  </h4>
                  <ul className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-300 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Examples
                  </h4>
                  <div className="space-y-2">
                    {type.examples.map((example, exampleIndex) => (
                      <div
                        key={exampleIndex}
                        className="bg-gray-700/30 rounded-lg p-3"
                      >
                        <span className="text-gray-300 text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    href="/auth/signup"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Join Communities
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors font-medium"
                  >
                    Create Your Own
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-blue-500/20 p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start Connecting Today
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join existing text, voice, and video communities or create your
              own. Connect with logistics professionals in the way that works
              best for you and build meaningful relationships across the
              industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg"
              >
                Join Communities
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 hover:text-white transition-all duration-200 font-semibold border border-gray-700 text-lg"
              >
                Create Your Community
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Already a member?{' '}
                <Link
                  href="/auth/signin"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
