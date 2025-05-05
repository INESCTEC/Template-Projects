import React from 'react';
import { Link } from 'react-router-dom';
import { IoRocket, IoStar, IoGitBranch, IoArrowForward } from 'react-icons/io5';
import ScrollNavbar from '../components/ScrollNavbar';
import Footer from '../components/Footer';
import config from '../config';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero section */}
      <div 
        className="h-screen flex items-center relative overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('/header-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: config.colors.primary
        }}
      >
        <ScrollNavbar />
        
        <div className="container mx-auto px-4 text-center text-white z-10">
          <img 
            src={config.logo} 
            alt={`${config.organization} Logo`}
            className="h-24 mx-auto mb-6"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{config.title}</h1>
          <h2 className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Explore open source projects from {config.organization}
          </h2>
          
          <Link 
            to="/projects" 
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            style={{ backgroundColor: config.colors.accent }}
          >
            View Projects <IoArrowForward className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Project Showcase Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <IoRocket 
                  size={28} 
                  className="text-blue-600"
                  style={{ color: config.colors.primary }} 
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Projects</h3>
              <p className="text-gray-600">
                Browse through all the GitHub projects from {config.organization} in one place.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <IoStar 
                  size={28} 
                  className="text-blue-600"
                  style={{ color: config.colors.primary }} 
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Top Repositories</h3>
              <p className="text-gray-600">
                See the most popular repositories with star counts and detailed information.
              </p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <IoGitBranch 
                  size={28} 
                  className="text-blue-600"
                  style={{ color: config.colors.primary }} 
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Filter & Sort</h3>
              <p className="text-gray-600">
                Easily find what you're looking for with powerful filtering and sorting options.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories preview */}
      <div className="py-16 bg-gray-50" style={{ backgroundColor: `${config.colors.primary}05` }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Project Categories</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.categories.filter(category => category.id !== 'all').slice(0, 6).map((category) => (
              <Link 
                key={category.id}
                to={`/projects?category=${encodeURIComponent(category.label)}`}
                className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{category.label}</h3>
                <p className="text-gray-600 mb-4">
                  Explore {category.label.toLowerCase()} projects and repositories.
                </p>
                <span className="text-blue-600 font-medium inline-flex items-center">
                  View Category <IoArrowForward className="ml-1" />
                </span>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/projects" 
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              View All Categories <IoArrowForward className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* GitHub integration section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">Automatic GitHub Integration</h2>
          <p className="text-gray-600 mb-8">
            This showcase automatically updates from GitHub. It fetches the latest repositories, stars, and topics to keep your showcase current.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
            <h3 className="text-lg font-semibold mb-2">Easy Configuration</h3>
            <p className="text-gray-600 mb-4">
              Just update the config.js file with your organization name and projects:
            </p>
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`// config.js
export default {
  organization: "${config.organization}",
  title: "${config.title}",
  // ...and more configuration options
}`}</code>
            </pre>
          </div>
          
          <a 
            href="https://github.com/yourusername/github-projects-showcase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition-colors"
          >
            Get Started on GitHub <IoArrowForward className="ml-2" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;