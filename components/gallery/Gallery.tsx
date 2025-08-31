import React, { useEffect, useRef } from 'react';
// @ts-ignore
import Three from './utils/Three';

const Gallery: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const threeInstance = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !threeInstance.current) {
      // Add a small delay to ensure DOM is fully rendered
      setTimeout(() => {
        try {
          threeInstance.current = new Three({
            dom: canvasRef.current,
          });
        } catch (error) {
          console.error('Error initializing Three.js:', error);
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      if (threeInstance.current) {
        // Call cleanup function if it exists
        if (typeof (window as any).galleryCleanup === 'function') {
          (window as any).galleryCleanup();
        }
        // Dispose of Three.js resources if needed
        threeInstance.current = null;
      }
    };
  }, []);

  // Handle image click to trigger fullscreen in Three.js
  const handleImageClick = (e: React.MouseEvent) => {
    // Prevent the default anchor behavior
    e.preventDefault();
    // The Three.js instance will handle the click through its own event listeners
  };

  return (
    <main style={{ width: '100%', position: 'relative', top: 0, left: 0 }}>
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
        <p style={{ fontSize: 'calc(100vw / 4)' }} className="dark:hidden">Gallery</p>
      </div>
      
      <div ref={canvasRef} className="canvas" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 2, 
        pointerEvents: 'none', // Keep pointer events disabled by default
        touchAction: 'auto' // Allow normal touch actions
      }}></div>

      <div className="info dark:text-white" style={{ 
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
        }} className="dark:text-white">
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
        }} className="dark:text-white">
          CLICK &nbsp; ANYWHERE &nbsp; TO &nbsp; BACK
        </h1>
      </div>

      <div className="projects dark:text-white" style={{ 
        position: 'relative', 
        top: '0', 
        left: 0, 
        width: '100%', 
        backgroundColor: 'transparent', 
        zIndex: 3, // Changed from 1 to 3 to be above canvas but below info
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'column', 
        padding: 'calc(100vw / 30 * 2) 0', 
        transition: 'none',
        minHeight: '100vh', // Ensure it takes at least full viewport height
        paddingTop: '100px' // Adjusted to place slightly below navbar (navbar height ~80px + 20px gap)
      }}>
        <div className="projects_lines" style={{ 
          width: 'calc(100vw / 30 * 19)', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: 'calc(100vw / 30 * 1.2)' 
        }}>
          <div className="project_container" style={{ marginTop: 'calc(100vw / 30 * 1.8 - 8px)' }}>
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>019</span></div>
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
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>MN concept movie</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>018</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/2.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/2.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>TELE - Play - prism</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>017</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/3.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/3.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 1</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>016</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/4.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/4.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 2</span></h2>
            </a>
          </div>
        </div>
        <div className="projects_lines" style={{ 
          width: 'calc(100vw / 30 * 19)', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: 'calc(100vw / 30 * 1.2)' 
        }}>
          <div className="project_container" style={{ marginTop: 'calc(100vw / 30 * 1.8 - 8px)' }}>
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>015</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/5.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/5.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>CITIZEN - Attesa</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>014</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/6.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/6.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>NIGHT Stroll</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>013</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/7.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/7.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 3</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>012</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/8.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/8.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 4</span></h2>
            </a>
          </div>
        </div>
        <div className="projects_lines" style={{ 
          width: 'calc(100vw / 30 * 19)', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          gap: 'calc(100vw / 30 * 1.2)' 
        }}>
          <div className="project_container" style={{ marginTop: 'calc(100vw / 30 * 1.8 - 8px)' }}>
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>011</span></div>
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
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Xperiax ERA</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>010</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/2.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/2.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>MTV Ultrahits</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>009</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/3.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/3.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 5</span></h2>
            </a>
          </div>
          <div className="project_container">
            <a href="#" onClick={handleImageClick} style={{ textDecoration: 'none', color: 'black' }} className="dark:text-white">
              <div className="list_num dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.33)' }}><span>008</span></div>
              <div className="list_img_cont" style={{ 
                width: 'calc(100vw / 30 * 5.2)', 
                height: 'calc(100vw / 30 * 3.0)', 
                backgroundColor: '#e5e5e5' 
              }}>
                <img data-webgl-media src="/gallery/4.jpg" alt="" style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  opacity: 1, 
                  zIndex: 1, 
                  pointerEvents: 'none' 
                }} />
                <video className="project_video" src="/gallery/4.mp4" loop muted style={{ display: 'none' }}></video>
              </div>
              <h2 className="list_title dark:text-white" style={{ fontSize: 'calc(100vw / 30 * 0.45)' }}><span>Additional Project 6</span></h2>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Gallery;