import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import image from '../assets/circuit.png';
import { useLocation } from 'react-router-dom';
import ScrollNavbar from '../components/ScrollNavbar';
import config from '../config';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortByStars, setSortByStars] = useState(null);
  const [sortByRepos, setSortByRepos] = useState(null);

  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const defaultCategory = queryParams.get('category') || 'All';

  // Get categories from config or use default if not specified
  const categories = config.categories?.map(cat => cat.label) || ['All', 'Energy'];

  useEffect(() => {
    fetch('/projects.json')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error('Data is not an array:', data);
        }
      })
      .catch(error => {
        console.error('Error loading the data:', error);
        setProjects([]);
      });
  }, []);

  useEffect(() => {
    const category = queryParams.get('category');
    if (category) setCategoryFilter(category);
  }, [queryParams]);

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
    setActiveFilters([]); 
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    if (!activeFilters.includes(tag)) {
      setActiveFilters([...activeFilters, tag]);
      setCategoryFilter('All'); 
      setCurrentPage(1);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setActiveFilters(activeFilters.filter((tag) => tag !== tagToRemove));
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  const filteredProjects = projects
    .filter((project) => {
      // Handle potential undefined project_area
      if (!project.project_area) return categoryFilter === 'All';
      
      const categoryMatch = categoryFilter === 'All' || 
                           project.project_area.toLowerCase() === categoryFilter.toLowerCase();
      
      // Handle potential undefined project_tags
      if (!project.project_tags) return categoryMatch && activeFilters.length === 0;
      
      const tagMatch = activeFilters.length === 0 || 
                      activeFilters.every((filter) =>
                        project.project_tags.map(tag => tag.toLowerCase()).includes(filter.toLowerCase())
                      );
      
      return categoryMatch && tagMatch;
    })
    .filter((project) => {
      if (searchTerm === '') return true;
      
      const nameMatch = project.project_name && 
                        project.project_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Handle potential undefined project_tags
      const tagMatch = project.project_tags && 
                      project.project_tags.some(tag => 
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                      );
      
      return nameMatch || tagMatch;
    })
    .sort((a, b) => {
      if (sortByStars) {
        return sortByStars === 'asc' ? a.total_stars - b.total_stars : b.total_stars - a.total_stars;
      }
      if (sortByRepos) {
        return sortByRepos === 'asc' ? a.total_repositories - b.total_repositories : b.total_repositories - a.total_repositories;
      }
      return 0;
    });

  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleSortByStars = () => {
    setSortByStars(sortByStars ? null : 'asc');
    setSortByRepos(null);
  };

  const handleSortByRepos = () => {
    setSortByRepos(sortByRepos ? null : 'asc');
    setSortByStars(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white font-mono relative">
        <img src={image} alt={config.organization} className="absolute top-0 left-0 w-full h-auto z-0" />
  
        {/* Fade-in Navbar */}
        <ScrollNavbar />

        {/* Main content */}
        <div className="flex-grow mt-16 relative z-10">
          <div className="mt-6 mb-12 bg-white">
            <Header
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              activeFilters={activeFilters}
              onRemoveTag={handleRemoveTag}
              onSortByStars={handleSortByStars}
              onSortByRepos={handleSortByRepos}
              sortByStars={sortByStars}
              sortByRepos={sortByRepos}
              defaultCategory={defaultCategory} 
              onCategoryChange={handleCategoryChange}
            />
            <div className="mt-4 mb-4 pb-2 pt-2">
              {currentProjects.length > 0 ? (
                currentProjects.map((project, index) => (
                  <React.Fragment key={index}>
                    <ProjectCard project={project} onTagClick={handleTagClick} />
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-10 mx-8 md:mx-16 bg-gray-50 rounded-lg">
                  <p className="text-dark-blue-2">No projects found matching your criteria.</p>
                  {activeFilters.length > 0 || searchTerm || categoryFilter !== 'All' ? (
                    <button 
                      className="mt-4 px-4 py-2 bg-light-blue-2 hover:bg-light-blue text-white rounded-full"
                      onClick={() => {
                        setActiveFilters([]);
                        setSearchTerm('');
                        setCategoryFilter('All');
                      }}
                    >
                      Clear all filters
                    </button>
                  ) : null}
                </div>
              )}
            </div>
  
            <div className="flex justify-center md:flex md:justify-end mt-2 md:mr-14 text-sm">
              <button
                className={`px-3 py-1 border border-gray-300 rounded-l-lg ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-black'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 border-t border-b border-l border-gray-300 ${
                    currentPage === index + 1 ? 'bg-gray-100 text-black' : 'bg-white text-black'
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`px-3 py-1 border border-gray-300 rounded-r-lg ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-black'
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
  
        {/* Footer */}
        <Footer />
      </div>
    </>
  );  
};

export default ProjectsPage;