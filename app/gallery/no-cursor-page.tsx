'use client';

import React from 'react';
import Gallery from '../../components/gallery/Gallery';

export default function NoCursorGalleryPage() {
  return (
    <div className="w-full min-h-screen">
      <style jsx global>{`
        html, body {
          cursor: auto !important;
        }
      `}</style>
      <Gallery />
    </div>
  );
}