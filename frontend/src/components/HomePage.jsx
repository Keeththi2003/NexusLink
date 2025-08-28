// =_=================================================================_
// SECTION 1: IMPORTS & HELPERS
// =_=================================================================_
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import TestimonialCard from '../components/TestimonialCard';
import { useTheme } from '../context/ThemeContext';
import { FaUserGraduate, FaBuilding, FaRocket, FaArrowRight } from 'react-icons/fa6';

// Import Typed.js for the animation
import Typed from 'typed.js';

// Helper component for the animated number
const CountUpNumber = ({ target, suffix, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end)) return;
    
    const duration = 2000;
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    const increment = end / totalFrames;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / frameRate);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

// =_=================================================================_
// SECTION 2: STATIC DATA
// =_=================================================================_
const backgroundImages = [ '/images/hero1.jpg', '/images/hero2.jpg', '/images/hero3.jpg' ];

const testimonialsData = [
  { id: 't1', image: '/images/testimonial1.jpeg', name: 'Priya Sharma', job: 'Software Engineer', opinion: 'This platform was a game-changer. I found an internship that matched my exact skill set and it turned into a full-time job offer.' },
  { id: 't2', image: '/images/testimonial2.jpeg', name: 'Michael Chen', job: 'Founder of Innovate Inc.', opinion: 'As a startup founder, posting my idea here brought me not just visibility, but also a co-founder with the technical skills I was missing.' },
  { id: 't3', image: '/images/testimonial3.jpeg', name: 'Sofia Rossi', job: 'UI/UX Designer', opinion: 'The quality of job advertisements is top-notch. I found a role at a design-focused company that truly values creativity.' },
];

// =_=================================================================_
// SECTION 3: THE MAIN HOME PAGE COMPONENT
// =_=================================================================_
const HomePage = () => {
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const { isDarkMode } = useTheme();
  const aboutSectionRef = useRef(null);
  const typedEl = useRef(null);
  const typedInstanceRef = useRef(null);

  // Effect for background image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  // Effect for the "human writing" typing animation
  useEffect(() => {
    const stringsToType = [
      "NexusLink is more than just a platform; it's an ecosystem. Our core mission is to empower the next generation by creating direct pathways to the most exciting opportunities in the tech industry. We provide a hub where students can showcase skills, startups can share their vision, and companies can discover the talent that will shape their future."
    ];

    const options = {
      strings: stringsToType,
      typeSpeed: 25,
      loop: false,
      showCursor: true,
      cursorChar: "|",
      onComplete: (self) => {
        self.cursor.style.display = 'none';
      },
    };

    if (typedEl.current) {
        typedInstanceRef.current = new Typed(typedEl.current, options);
    }

    return () => {
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, []);

  // Effect for observing when the stats section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStatsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    
    const currentRef = aboutSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Effect to scroll to footer if URL hash is present
  useEffect(() => {
    if (location.hash === '#footer-contact') {
      const footer = document.getElementById('footer-contact');
      if (footer) {
        setTimeout(() => footer.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-200">
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt="Platform background" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`} 
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Ambition</span> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Opportunity</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary-200 max-w-3xl mx-auto leading-relaxed">
            Welcome to NexusLink, the premier ecosystem designed to bridge the gap between emerging talent and innovative companies.
          </p>
        </div>
      </section>

      {/* --- PERSONA SECTION --- */}
      <section className="py-20 px-4 bg-white dark:bg-secondary-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Are You...?
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Choose your path and discover opportunities tailored to your goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <Link to="/talentD" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaUserGraduate className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                    Student or Intern
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 mb-6 leading-relaxed">
                    Showcase your skills, discover internships, and connect with companies that match your ambition.
                  </p>
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                    Explore Talent Profiles <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Company Card */}
            <Link to="/findus" className="group">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaBuilding className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
                    Company
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-6 leading-relaxed">
                    Access a curated pool of top-tier talent, post job openings, and build your dream team effortlessly.
                  </p>
                  <div className="flex items-center justify-center text-green-600 dark:text-green-400 font-medium group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-200">
                    Discover Top Talent <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Startup Card */}
            <Link to="/startup" className="group">
              <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100 mb-4">
                    Startup or Innovator
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 mb-6 leading-relaxed">
                    Share your groundbreaking vision, find co-founders, and connect with a vibrant community of builders.
                  </p>
                  <div className="flex items-center justify-center text-orange-600 dark:text-orange-400 font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors duration-200">
                    Showcase Your Vision <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section ref={aboutSectionRef} className="py-20 px-4 bg-secondary-100 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-8">
                About Us
              </h2>
              <div className="text-lg text-secondary-700 dark:text-secondary-300 leading-relaxed">
                <span ref={typedEl}></span>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-8 ${isStatsVisible ? 'animate-fade-in' : 'opacity-0'}`}>
              <div className="text-center">
                <CountUpNumber target={8000} suffix="+" isVisible={isStatsVisible} />
                <div className="text-lg font-medium text-secondary-600 dark:text-secondary-400 mt-2">
                  Matches Made
                </div>
              </div>
              <div className="text-center">
                <CountUpNumber target={150} suffix="K+" isVisible={isStatsVisible} />
                <div className="text-lg font-medium text-secondary-600 dark:text-secondary-400 mt-2">
                  Tech Jobs
                </div>
              </div>
              <div className="text-center col-span-2">
                <CountUpNumber target={1000} suffix="+" isVisible={isStatsVisible} />
                <div className="text-lg font-medium text-secondary-600 dark:text-secondary-400 mt-2">
                  Candidates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-20 px-4 bg-white dark:bg-secondary-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
              Voices of Our Community
            </h2>
            <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Hear from the people who've found success through our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsData.map(testimonial => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;