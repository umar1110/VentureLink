import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-primary-600" />,
      title: 'AI-Powered Analysis',
      description: 'Our machine learning algorithms evaluate business ideas across multiple dimensions including market fit, scalability, and innovation.',
    },
    {
      icon: <Zap className="h-10 w-10 text-primary-600" />,
      title: 'Quick Connections',
      description: 'Get matched with the right investors who are specifically interested in your industry and business model.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary-600" />,
      title: 'Expert Network',
      description: 'Access a network of industry experts, mentors, and successful entrepreneurs who can provide guidance.',
    },
  ];

  const redirectToDashboard = () => {
    if (user?.role === 'entrepreneur') {
      return '/entrepreneur-dashboard';
    }
    return '/investor-dashboard';
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-secondary-700 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Connecting <span className="text-accent-400">Innovators</span> with <span className="text-accent-400">Investors</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Venture Link uses machine learning to evaluate business ideas and connect entrepreneurs with the right investors. Submit your idea today and get noticed by the investors who matter.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to={redirectToDashboard()}>
                    <Button size="lg" className="text-md font-semibold">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button size="lg" className="text-md font-semibold">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/how-it-works">
                      <Button variant="outline" size="lg" className="text-md font-semibold border-white text-white hover:bg-white/10">
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-6">
              <div className="relative mt-12 lg:mt-0">
                <img
                  className="relative rounded-lg shadow-xl"
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Entrepreneurs meeting with investors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Venture Link Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform leverages cutting-edge technology to streamline the connection between ideas and capital.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Turn Your Idea into Reality?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join Venture Link today and connect with investors who believe in your vision.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Link to={redirectToDashboard()}>
                <Button size="lg" className="text-md font-semibold bg-white text-primary-700 hover:bg-gray-100">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="text-md font-semibold bg-white text-primary-700 hover:bg-gray-100">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-md font-semibold border-white text-white hover:bg-white/10">
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};