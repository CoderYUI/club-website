'use client';

import React, { useState, useEffect } from 'react';
import styles from './InfiniteScroll.module.css';

const InfiniteScroll = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices on component mount
  useEffect(() => {
    // Check if it's a touch device
    const checkMobile = () => {
      const isTouchDevice = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
      setIsMobile(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Sample items for the infinite scroll with club-related content
  const items = [
    { id: 1, name: 'Workshops' },
    { id: 2, name: 'Hackathons' },
    { id: 3, name: 'Tech Talks' },
    { id: 4, name: 'Projects' },
    { id: 5, name: 'Mentorship' },
    { id: 6, name: 'Networking' },
    { id: 7, name: 'Competitions' },
    { id: 8, name: 'Resources' },
    { id: 9, name: 'Tutorials' },
    { id: 10, name: 'Webinars' },
    { id: 11, name: 'Bootcamps' },
    { id: 12, name: 'Challenges' },
    { id: 13, name: 'Showcases' },
    { id: 14, name: 'Meetups' },
    { id: 15, name: 'Seminars' },
    { id: 16, name: 'Labs' },
  ];

  // Create multiple duplicates for smoother infinite scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="py-8 bg-white dark:bg-[#131313]">
      <div className={styles.wrapper}>
        <div 
          className={`${styles.track} ${isMobile ? styles.noInterrupt : ''}`}
          onTouchStart={(e) => {
            // Prevent touch events from causing scroll pauses on mobile
            if (isMobile) {
              e.stopPropagation();
            }
          }}
        >
          {duplicatedItems.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className={styles.item}
              onTouchStart={(e) => isMobile && e.stopPropagation()}
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;