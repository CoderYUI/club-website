import React, { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Gallery: React.FC = () => {
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState({ src: '', alt: '' });
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const lenisRef = useRef<any>(null);
  const animationInitialized = useRef(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Initialize client-side only features
  useEffect(() => {
    setIsClient(true);
    
    // Check if it's a mobile device
    const checkMobile = () => {
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
      setIsMobile(isTouchDevice);
    };

    checkMobile();
  }, []);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      // Clean up Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      // Clean up all ScrollTriggers
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Initialize animations only once
  const initializeAnimations = useCallback(() => {
    if (animationInitialized.current || !isClient) return;
    animationInitialized.current = true;

    // Ensure GSAP plugins are registered
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Add syncTouch to work better with ScrollTrigger
      syncTouch: true,
    });
    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    
    // Tell ScrollTrigger to use Lenis as the scroller
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop: (value?: number) => {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value as number);
          return value as number;
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update(); // Update ScrollTrigger on each frame
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Refresh ScrollTrigger after creation
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [isClient]);

  // Initialize animations when client is ready
  useEffect(() => {
    if (isClient) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        initializeAnimations();
      });
    }
  }, [isClient, initializeAnimations]);

  // Handle image click - to open modal
  const handleImageClick = (e: React.MouseEvent, image: { src: string; alt: string }) => {
    e.preventDefault();
    setModalImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Event data structure
  const events = [
    {
      id: 1,
      title: "Tech Innovation Summit",
      date: "March 15, 2024",
      description: "Annual summit showcasing cutting-edge technology innovations and research breakthroughs.",
      images: [
        { src: "/gallery/1.jpg", alt: "Tech Summit 1" },
        { src: "/gallery/2.jpg", alt: "Tech Summit 2" },
        { src: "/gallery/3.jpg", alt: "Tech Summit 3" },
        { src: "/gallery/4.jpg", alt: "Tech Summit 4" },
        { src: "/gallery/5.jpg", alt: "Tech Summit 5" },
        { src: "/gallery/6.jpg", alt: "Tech Summit 6" },
        { src: "/gallery/7.jpg", alt: "Tech Summit 7" },
        { src: "/gallery/8.jpg", alt: "Tech Summit 8" }
      ]
    },
    {
      id: 2,
      title: "Research Symposium",
      date: "April 22, 2024",
      description: "Student-led research presentations covering diverse fields from AI to biotechnology.",
      images: [
        { src: "/gallery/1.jpg", alt: "Research Symposium 1" },
        { src: "/gallery/2.jpg", alt: "Research Symposium 2" },
        { src: "/gallery/3.jpg", alt: "Research Symposium 3" },
        { src: "/gallery/4.jpg", alt: "Research Symposium 4" },
        { src: "/gallery/5.jpg", alt: "Research Symposium 5" },
        { src: "/gallery/6.jpg", alt: "Research Symposium 6" },
        { src: "/gallery/7.jpg", alt: "Research Symposium 7" },
        { src: "/gallery/8.jpg", alt: "Research Symposium 8" }
      ]
    },
    {
      id: 3,
      title: "Hackathon Challenge",
      date: "May 10, 2024",
      description: "48-hour coding marathon where students build innovative solutions to real-world problems.",
      images: [
        { src: "/gallery/1.jpg", alt: "Hackathon 1" },
        { src: "/gallery/2.jpg", alt: "Hackathon 2" },
        { src: "/gallery/3.jpg", alt: "Hackathon 3" },
        { src: "/gallery/4.jpg", alt: "Hackathon 4" },
        { src: "/gallery/5.jpg", alt: "Hackathon 5" },
        { src: "/gallery/6.jpg", alt: "Hackathon 6" },
        { src: "/gallery/7.jpg", alt: "Hackathon 7" },
        { src: "/gallery/8.jpg", alt: "Hackathon 8" }
      ]
    }
  ];

  // Create duplicated images for infinite scroll (desktop only)
  const getDuplicatedImages = (images: any[]) => {
    if (isMobile) return images;
    // Create multiple duplicates for smoother infinite scroll
    return [...images, ...images, ...images];
  };

  // Prevent rendering until client-side is ready
  if (!isClient) {
    return (
      <main style={{ width: '100%', position: 'relative', top: 0, left: 0 }}>
        <div className="gallery-header dark:text-white" style={{ 
          position: 'relative',
          width: '100%',
          padding: '30px 0 20px 0',
          textAlign: 'center',
          zIndex: 10
        }}>
          <div className="max-w-7xl mx-auto px-6">
          </div>
        </div>
      </main>
    );
  }

  return (
    <main 
      ref={galleryRef}
      style={{ width: '100%', position: 'relative', top: 0, left: 0 }}
    >
      {/* Gallery Header - Minimal padding to reduce blank space */}
      <div className="gallery-header dark:text-white" style={{ 
        position: 'relative',
        width: '100%',
        padding: '30px 0 20px 0', // Minimal padding to reduce blank space
        textAlign: 'center',
        zIndex: 10
      }}>
        <div className="max-w-7xl mx-auto px-6">
        </div>
      </div>

      {/* Events Section */}
      <div className="events dark:text-white" style={{ 
        position: 'relative', 
        width: '100%', 
        backgroundColor: 'transparent', 
        zIndex: 3,
        padding: '10px 0 100px 0' // Reduced top padding
      }}>
        <div className="max-w-7xl mx-auto px-6">
          {events.map((event, index) => (
            <div key={event.id} className="event-section mb-20 last:mb-0" style={{ 
              marginTop: index === 0 ? '30px' : '0' // Add margin to the first event section
            }}>
              {/* Event Header - Improved styling to match home page sections */}
              <div className="event-header text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-extralight tracking-[-0.02em] text-black dark:text-white mb-2 leading-[0.9] font-serif">
                  {event.title}
                </h2>
                <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mb-4">
                  <span className="text-sm">{event.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-extralight">
                  {event.description}
                </p>
              </div>

              {/* Event Images Grid with Infinite Scroll for Desktop */}
              <div 
                className={`event-images-container ${!isMobile ? 'infinite-scroll-container' : ''}`}
                style={{ 
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Desktop Infinite Scroll Wrapper */}
                {!isMobile && (
                  <div 
                    className="infinite-scroll-track"
                    style={{
                      display: 'flex',
                      width: 'fit-content',
                      animation: 'scroll 60s linear infinite',
                      padding: 0,
                      margin: 0,
                      willChange: 'transform'
                    }}
                    onMouseEnter={(e) => {
                      // Pause animation on hover for desktop
                      const target = e.currentTarget as HTMLElement;
                      target.style.animationPlayState = 'paused';
                    }}
                    onMouseLeave={(e) => {
                      // Resume animation when not hovering
                      const target = e.currentTarget as HTMLElement;
                      target.style.animationPlayState = 'running';
                    }}
                  >
                    {getDuplicatedImages(event.images).map((image, imgIndex) => (
                      <div 
                        key={`${event.id}-${imgIndex}`} 
                        className="image-container-infinite"
                        style={{ 
                          position: 'relative',
                          width: '250px',
                          height: '250px',
                          backgroundColor: 'transparent',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer',
                          margin: '0 10px',
                          flexShrink: 0
                        }}
                        onClick={(e) => handleImageClick(e, image)}
                        onMouseEnter={(e) => {
                          // Enhance shadow and scale on hover for desktop
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                          
                          // Show overlay
                          const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement;
                          if (overlay) {
                            overlay.style.opacity = '1';
                          }
                        }}
                        onMouseLeave={(e) => {
                          // Reset styles when not hovering
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                          
                          // Hide overlay
                          const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement;
                          if (overlay) {
                            overlay.style.opacity = '0';
                          }
                        }}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 1,
                            transition: 'opacity 0.3s ease'
                          }} 
                        />
                        {/* Overlay for better visibility on hover */}
                        <div 
                          className="image-overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <div style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'light',
                            textAlign: 'center',
                            padding: '10px'
                          }}>
                            View Image
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Mobile Grid Layout (unchanged) */}
                {isMobile && (
                  <div 
                    className="event-images-grid"
                    style={{ 
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: 'calc(100vw / 30 * 1.2)',
                      width: '100%'
                    }}
                  >
                    {event.images.map((image, imgIndex) => (
                      <div 
                        key={imgIndex} 
                        className="image-container"
                        style={{ 
                          position: 'relative',
                          width: '100%',
                          height: '0',
                          paddingBottom: '100%', // Square aspect ratio
                          backgroundColor: 'transparent',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => handleImageClick(e, image)}
                        onMouseEnter={(e) => {
                          // Enhance shadow and scale on hover for desktop
                          if (window.innerWidth > 768) {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                            
                            // Show overlay
                            const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement;
                            if (overlay) {
                              overlay.style.opacity = '1';
                            }
                          }
                        }}
                        onMouseLeave={(e) => {
                          // Reset styles when not hovering
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                          
                          // Hide overlay
                          const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement;
                          if (overlay) {
                            overlay.style.opacity = '0';
                          }
                        }}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt} 
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center',
                            opacity: 1,
                            transition: 'opacity 0.3s ease'
                          }} 
                        />
                        {/* Overlay for better visibility on hover */}
                        <div 
                          className="image-overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <div style={{
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'light',
                            textAlign: 'center',
                            padding: '10px'
                          }}>
                            View Image
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for image viewing */}
      {isModalOpen && (
        <div 
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            opacity: 0,
            animation: 'modalFadeIn 0.3s forwards'
          }}
          onClick={closeModal}
        >
          <div 
            className="modal-content"
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              animation: 'modalSlideIn 0.3s forwards'
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                zIndex: 10000
              }}
            >
              ×
            </button>
            <img 
              src={modalImage.src} 
              alt={modalImage.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Media query for mobile responsiveness */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Infinite scroll animation */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        
        .infinite-scroll-container {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          height: 270px;
        }
        
        .infinite-scroll-track {
          display: flex;
          width: fit-content;
          animation: scroll 60s linear infinite;
          padding: 0;
          margin: 0;
          will-change: transform;
        }
        
        .image-container-infinite:hover .image-overlay {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .event-images-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
            gap: calc(100vw / 30 * 0.8) !important;
          }
          
          .gallery-header {
            padding: 20px 0 10px 0 !important; /* Minimal padding for mobile */
          }
          
          .event-header {
            margin-bottom: 30px !important;
          }
          
          .events {
            padding: 0 0 80px 0 !important; /* Minimal padding for mobile */
          }
          
          /* Add more margin to first event section on mobile */  
          .event-section:first-child {
            margin-top: 60px !important;
          }
          
          /* Disable hover effects on mobile */
          .image-container {
            transform: none !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
          }
          
          .image-overlay {
            display: none !important;
          }
          
          .modal-content {
            maxWidth: 95% !important;
            maxHeight: 85vh !important;
          }
          
          /* Hide infinite scroll on mobile */
          .infinite-scroll-container {
            mask-image: none;
            height: auto;
          }
          
          .infinite-scroll-track {
            display: none;
          }
        }
        
        @media (max-width: 480px) {
          .event-images-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .modal-content img {
            maxHeight: 70vh !important;
          }
        }
        
        /* Ensure proper cursor on desktop */
        @media (min-width: 769px) {
          .image-container, .image-container-infinite {
            cursor: pointer;
          }
        }
      `}</style>
    </main>
  );
};

export default Gallery;