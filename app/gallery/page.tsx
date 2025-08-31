'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Gallery component to avoid SSR issues with Three.js
const Gallery = dynamic(() => import('../../components/gallery/Gallery'), {
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center">Loading gallery...</div>
});

export default function GalleryPage() {
  return (
    <div className="w-full min-h-screen">
      <Gallery />
    </div>
  );
}