'use client';

import React, { useEffect, useRef } from 'react';

const TestGallery: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && canvasRef.current) {
      // Simple test to see if we can detect mouse events
      const handleMouseMove = (e: MouseEvent) => {
        console.log('Mouse move detected:', e.clientX, e.clientY);
      };

      const handleClick = (e: MouseEvent) => {
        console.log('Click detected:', e.clientX, e.clientY);
        e.preventDefault();
      };

      const container = canvasRef.current;
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);

      // Change the background color to see if the element is visible
      container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      container.style.pointerEvents = 'auto';

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Test Gallery</h1>
      <div 
        ref={canvasRef} 
        className="w-64 h-64 border-2 border-blue-500"
        style={{ pointerEvents: 'auto' }}
      >
        <p className="text-center p-4">Hover and click here</p>
      </div>
    </div>
  );
};

export default TestGallery;