'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the TestThree component to avoid SSR issues
const TestThree = dynamic(() => import('../../components/gallery/TestThree'), {
  ssr: false,
  loading: () => <div className="h-screen w-full flex items-center justify-center">Loading Three.js test...</div>
});

export default function TestThreePage() {
  return (
    <div className="w-full min-h-screen">
      <TestThree />
    </div>
  );
}