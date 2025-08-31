import React, { useEffect, useRef } from 'react';

const TestThree: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeInstance = useRef<any>(null);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;

    const initThree = async () => {
      try {
        console.log('Loading Three.js module...');
        const ThreeModule = await import('./utils/Three');
        const Three = ThreeModule.default;
        
        console.log('Three.js module loaded');
        
        if (canvasRef.current && !threeInstance.current) {
          console.log('Initializing Three.js with canvas element');
          
          // Wait a bit for DOM to be ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          threeInstance.current = new Three({
            dom: canvasRef.current as unknown as HTMLElement,
          });
          
          console.log('Three.js initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing Three.js:', error);
      }
    };

    initThree();

    // Cleanup function
    return () => {
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
      <h1>Three.js Test Component</h1>
      
      <div 
        ref={canvasRef} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.1)'
        }}
      >
        <p>Three.js Canvas Area</p>
      </div>
      
      {/* Hidden elements that Three.js expects */}
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

export default TestThree;