'use client';

import React, { useEffect } from 'react';

export default function WorkingTestPage() {
  useEffect(() => {
    // Check if required elements exist
    const checkElements = () => {
      const workElement = document.querySelector('.work p');
      const projectsElement = document.querySelector('.projects');
      const infoH1s = document.querySelectorAll('.info h1');
      const images = document.querySelectorAll("img[data-webgl-media]");
      const videos = document.querySelectorAll("video.project_video");
      
      console.log('DOM Elements Check:', {
        workElement: !!workElement,
        projectsElement: !!projectsElement,
        infoH1sCount: infoH1s.length,
        imageCount: images.length,
        videoCount: videos.length
      });
      
      return workElement && projectsElement && infoH1s.length >= 2 && images.length > 0;
    };
    
    // Try to initialize Three.js
    const initThree = async () => {
      if (checkElements()) {
        try {
          console.log('Attempting to load Three.js module...');
          const ThreeModule = await import('../../components/gallery/utils/Three');
          const Three = ThreeModule.default;
          
          const canvasElement = document.getElementById('three-canvas');
          if (canvasElement) {
            console.log('Initializing Three.js with canvas element');
            // @ts-ignore
            const threeInstance = new Three({
              dom: canvasElement,
            });
            console.log('Three.js initialized successfully', threeInstance);
          }
        } catch (error) {
          console.error('Error initializing Three.js:', error);
        }
      } else {
        console.log('Required elements not found, retrying in 500ms...');
        setTimeout(initThree, 500);
      }
    };
    
    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      initThree();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <h1>Working Gallery Test Page</h1>
      <div 
        id="three-canvas" 
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
      
      {/* Elements for Three.js to find */}
      <div className="work" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh', 
        backgroundColor: 'transparent', 
        zIndex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        color: 'rgba(0, 0, 0, 0.10)', 
        pointerEvents: 'none' 
      }}>
        <p style={{ fontSize: 'calc(100vw / 4)' }}>Gallery</p>
      </div>
      
      <div className="info" style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        width: '100%', 
        height: 'calc(100vw / 30 * 0.45)', 
        zIndex: 99, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        backgroundColor: 'transparent', 
        margin: 'calc(100vw / 30 * 0.15)' 
      }}>
        <h1 style={{ 
          textAlign: 'end', 
          fontSize: 'calc(100vw / 30 * 0.45)', 
          fontWeight: 400, 
          overflow: 'hidden', 
          position: 'absolute', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '100%', 
          mixBlendMode: 'difference', 
          color: 'gray' 
        }}>
          HOVER &nbsp; & &nbsp; CLICK &nbsp; IMAGES
        </h1>
        <h1 style={{ 
          textAlign: 'end', 
          fontSize: 'calc(100vw / 30 * 0.45)', 
          fontWeight: 400, 
          overflow: 'hidden', 
          position: 'absolute', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '100%', 
          mixBlendMode: 'difference', 
          color: '#f8f8f8' 
        }}>
          CLICK &nbsp; ANYWHERE &nbsp; TO &nbsp; BACK
        </h1>
      </div>
      
      <div className="projects" style={{ 
        position: 'relative', 
        top: '0', 
        left: 0, 
        width: '100%', 
        backgroundColor: 'transparent', 
        zIndex: 3,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        padding: 'calc(100vw / 30 * 2) 0', 
        transition: 'none',
        minHeight: '100vh',
        paddingTop: '100px'
      }}>
        <div className="projects_lines" style={{ 
          width: 'calc(100vw / 30 * 19)', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: 'calc(100vw / 30 * 1.2)' 
        }}>
          <div className="project_container" style={{ marginTop: 'calc(100vw / 30 * 1.8 - 8px)' }}>
            <a href="#" style={{ textDecoration: 'none', color: 'black' }}>
              <div className="list_num" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>001</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/1.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/1.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Test Project</span></h2>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}