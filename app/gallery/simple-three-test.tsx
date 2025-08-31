'use client';

import React, { useEffect, useRef } from 'react';

const SimpleThreeTest: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeInstance = useRef<any>(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;

    const initGallery = async () => {
      try {
        console.log('Loading Simple Three.js module...');
        const ThreeModule = await import('../../components/gallery/SimpleThree');
        const SimpleThree = ThreeModule.default;
        
        console.log('Simple Three.js module loaded');
        
        if (canvasRef.current && !threeInstance.current) {
          console.log('Initializing Simple Three.js with canvas element');
          
          threeInstance.current = new SimpleThree({
            dom: canvasRef.current as unknown as HTMLElement,
          });
          
          console.log('Simple Three.js initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing Simple Three.js:', error);
      }
    };

    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      initGallery();
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (threeInstance.current) {
        threeInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <h1>Simple Three.js Gallery Test</h1>
      
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
      </div>
      
      {/* Elements for Three.js to find */}
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

export default SimpleThreeTest;