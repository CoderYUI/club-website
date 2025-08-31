import React, { useEffect, useRef } from 'react';

const DebugGallery: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('DebugGallery mounted');
    
    // Check if required elements exist
    const workElement = document.querySelector('.work p');
    const projectsElement = document.querySelector('.projects');
    const infoH1s = document.querySelectorAll('.info h1');
    
    console.log('DOM Elements Check:', {
      workElement: !!workElement,
      projectsElement: !!projectsElement,
      infoH1sCount: infoH1s.length
    });
    
    // Check if images and videos exist
    const images = document.querySelectorAll("img[data-webgl-media]");
    const videos = document.querySelectorAll("video.project_video");
    
    console.log('Media Assets Check:', {
      imageCount: images.length,
      videoCount: videos.length,
      images: Array.from(images).map(img => (img as HTMLImageElement).src),
      videos: Array.from(videos).map(video => (video as HTMLVideoElement).src)
    });
    
    // Try to initialize Three.js
    const initThree = async () => {
      try {
        console.log('Attempting to load Three.js module...');
        const ThreeModule = await import('./utils/Three');
        const Three = ThreeModule.default;
        
        if (canvasRef.current) {
          console.log('Initializing Three.js with canvas element');
          // @ts-ignore
          const threeInstance = new Three({
            dom: canvasRef.current,
          });
          console.log('Three.js initialized successfully', threeInstance);
        }
      } catch (error) {
        console.error('Error initializing Three.js:', error);
      }
    };
    
    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      initThree();
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <h1>Gallery Debug Page</h1>
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

export default DebugGallery;