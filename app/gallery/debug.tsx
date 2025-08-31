'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the DebugGallery component to avoid SSR issues
const DebugGallery = dynamic(() => import('../../components/gallery/DebugGallery'), {
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center">Loading debug gallery...</div>
});

export default function GalleryDebugPage() {
  return (
    <div className="w-full min-h-screen">
      <DebugGallery />
    </div>
  );
}