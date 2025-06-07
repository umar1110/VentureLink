import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Briefcase, Zap, Users, TrendingUp, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      icon: <FileText className="h-10 w-10 text-primary-600" />,
      title: "Submit Your Business Idea",
      description: "Fill out our comprehensive submission form with details about your business idea, target market, and team. The more information you provide, the better our evaluation will be.",
      image: "https://images.pexels.com/photos/6224/hands-people-woman-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <Zap className="h-10 w-10 text-primary-600" />,
      title: "AI-Powered Evaluation",
      description: "Our machine learning model analyzes your idea across multiple dimensions, including market fit, scalability, innovation, team capability, and financial viability.",
      image: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary-600" />,
      title: "Receive Detailed Feedback",
      description: "Get a comprehensive evaluation report with scores in each category and actionable feedback to improve your business idea.",
      image: "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <Users className="h-10 w-10 text-primary-600" />,
      title: "Connect with Investors",
      description: "Your idea is showcased to investors who match your industry and requirements. Investors can express interest directly through the platform.",
      image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-primary-600" />,
      title: "Initiate Discussions",
      description: "When there's mutual interest, start direct conversations with investors through our secure messaging system.",
      image: "https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary-600" />,
      title: "Secure Funding & Grow",
      description: "Finalize investment terms and receive funding to turn your idea into reality. Use our platform to track progress and maintain investor relationships.",
      image: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  const faqItems = [
    {
      question: "How does the evaluation process work?",
      answer: "Our machine learning model analyzes your business idea across six key dimensions: market fit, scalability, innovation, team capability, financial viability, and investment potential. Each dimension receives a score, contributing to an overall evaluation. The process typically takes 24-48 hours."
    },
    {
      question: "What information do I need to provide for my business idea?",
      answer: "You'll need to provide details about your business concept, target market, unique selling proposition, problem being solved, proposed solution, business model, team composition, traction (if any), funding requirements, and equity offering. The more comprehensive your submission, the more accurate our evaluation will be."
    },
    {
      question: "Who will see my business idea?",
      answer: "Your business idea is only visible to verified investors on our platform who match your industry and investment criteria. We have strict confidentiality policies, and all users sign NDAs before accessing detailed information about any business idea."
    },
    {
      question: "How are investors vetted on the platform?",
      answer: "We verify all investor accounts through a rigorous process that includes identity verification, investment history review, and reference checks. Only accredited investors who meet our criteria are allowed to join the platform."
    },
    {
      question: "What happens after I connect with an investor?",
      answer: "Once mutual interest is established, you can communicate directly through our secure messaging system. If both parties agree to proceed, you can arrange video calls, in-person meetings, and share additional documents. Venture Link provides templates for term sheets and other investment documents, but we recommend consulting with your legal advisor before finalizing any agreements."
    },
    {
      question: "Is there a fee to use Venture Link?",
      answer: "Basic access to Venture Link is free for entrepreneurs. We charge a small success fee only when funding is successfully secured through our platform. Investors pay a subscription fee for access to our curated deal flow and evaluation insights."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-secondary-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-6">How Venture Link Works</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Our platform simplifies the journey from innovative idea to successful funding using advanced machine learning technology.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Venture Link Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to turn your business idea into a funded reality.
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row gap-10 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="lg:w-1/2">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="rounded-lg shadow-lg w-full h-80 object-cover"
                  />
                </div>
                <div className="lg:w-1/2">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600 mr-4">
                      <span className="font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex items-center bg-primary-50 p-2 rounded-full">
                      {step.icon}
                      <h3 className="text-xl font-bold text-gray-900 ml-3">{step.title}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-gray-700 ml-16">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation Criteria */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Evaluation Criteria</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use a comprehensive set of criteria to evaluate business ideas and provide valuable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Fit</h3>
              <p className="text-gray-700">
                We assess how well your product or service addresses a real market need, the size of your target market, and your competitive positioning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scalability</h3>
              <p className="text-gray-700">
                We evaluate how easily your business can grow, including your ability to increase revenue without proportionally increasing costs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-700">
                We measure the uniqueness of your solution, intellectual property potential, and technological advantages over existing alternatives.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Capability</h3>
              <p className="text-gray-700">
                We assess your team's experience, expertise, track record, and whether you have the right mix of skills to execute your business plan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Viability</h3>
              <p className="text-gray-700">
                We evaluate your business model, revenue projections, cost structure, and path to profitability or exit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Investment Potential</h3>
              <p className="text-gray-700">
                We assess the overall attractiveness to investors, including potential return on investment, time to exit, and risk factors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about Venture Link.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Whether you're an entrepreneur with a game-changing idea or an investor looking for promising opportunities, Venture Link is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-md font-semibold bg-white text-primary-700 hover:bg-gray-100">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/submit-idea">
              <Button variant="outline" size="lg" className="text-md font-semibold border-white text-white hover:bg-white/10">
                Submit Your Idea
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};