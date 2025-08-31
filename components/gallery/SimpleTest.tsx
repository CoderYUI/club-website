'use client';

import React, { useEffect, useRef } from 'react';

const SimpleTest: React.FC = () => {
  const testRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && testRef.current) {
      const element = testRef.current;
      
      // Test mouse events
      const handleMouseMove = (e: MouseEvent) => {
        console.log('SimpleTest: Mouse move detected');
      };

      const handleClick = (e: MouseEvent) => {
        console.log('SimpleTest: Click detected');
        e.preventDefault();
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('click', handleClick);

      // Make it visible
      element.style.backgroundColor = 'lightblue';
      element.style.cursor = 'pointer';

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div 
        ref={testRef} 
        className="w-64 h-64 flex items-center justify-center text-center p-4 cursor-pointer"
      >
        <p>Simple Test - Hover and click me</p>
      </div>
    </div>
  );
};

export default SimpleTest;