'use client';

import React, { useEffect, useRef } from 'react';

const GalleryTest: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeInstance = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Three.js component to avoid SSR issues
    const initGallery = async () => {
      try {
        const ThreeModule = await import('../../components/gallery/utils/Three');
        const Three = ThreeModule.default;
        
        if (canvasRef.current && !threeInstance.current) {
          console.log('Initializing Three.js gallery');
          threeInstance.current = new Three({
            dom: canvasRef.current,
          });
        }
      } catch (error) {
        console.error('Error initializing Three.js gallery:', error);
      }
    };

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      initGallery();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (threeInstance.current) {
        if (typeof (window as any).galleryCleanup === 'function') {
          (window as any).galleryCleanup();
        }
        threeInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <h1>Gallery Test Page</h1>
      <div 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 10 
        }}
      >
        {/* Canvas will be inserted here by Three.js */}
      </div>
      
      {/* Hidden elements for Three.js to find */}
      <div className="work" style={{ display: 'none' }}>
        <p>Gallery</p>
      </div>
      
      <div className="info" style={{ display: 'none' }}>
        <h1>HOVER &amp; CLICK IMAGES</h1>
        <h1>CLICK ANYWHERE TO BACK</h1>
      </div>
      
      <div className="projects" style={{ display: 'none' }}>
        <div className="projects_lines">
          <div className="project_container">
            <a href="#">
              <div className="list_num"><span>001</span></div>
              <div className="list_img_cont">
                <img data-webgl-media src="/gallery/1.jpg" alt="" />
                <video className="project_video" src="/gallery/1.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title"><span>Test Project</span></h2>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryTest;