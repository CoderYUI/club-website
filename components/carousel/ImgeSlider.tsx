"use client";

import React, { useState, useEffect } from "react";
import  Video  from "../video/video";
import BookComponent from "../book/bookComponent";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function ImageSlider() {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);

    return () => {
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center mt-8 md:mt-12 lg:mt-16 mb-0 md:mb-4 lg:mb-6 gap-y-8 px-4 sm:px-6 w-full overflow-hidden">
      {/* Upcoming Events Section - Magazine Style Redesign */}
      <div className={`w-full max-w-7xl mx-auto transition-all duration-700 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Enhanced Section Header with Magazine-style Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto"
        >
          {/* Small overline text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span className="inline-block px-6 py-2 text-xs font-medium tracking-[0.2em] uppercase text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
              Special Event
            </span>
          </motion.div>

          {/* Main heading with magazine-style typography */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[-0.02em] text-black dark:text-white mb-6 leading-[0.9] font-serif max-w-5xl mx-auto">
            <span className="block lg:inline">Dataverse</span>
            <span className="block lg:inline font-thin italic bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mt-2 lg:mt-0 lg:ml-4 dark:bg-gradient-to-r dark:from-red-400 dark:via-red-500 dark:to-red-600">
              '25
            </span>
          </h1>
        </motion.div>

        {/* Editorial Layout Event Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Visual Storytelling */}
          <div className="relative h-[600px] md:h-[650px] lg:h-[700px] rounded-2xl overflow-hidden">
            <Image
              src="/images/Dataverse.jpg"
              alt="Dataverse' 25"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Editorial Date Stamp */}
            <div className="absolute top-6 left-6 bg-white dark:bg-black px-4 py-2 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-serif font-bold text-black dark:text-white">18</div>
                <div className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">SEPT 2025</div>
              </div>
            </div>
            
            {/* Editorial Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-white">
                <h3 className="text-2xl font-light">Dataverse' 25</h3>
                <p className="text-sm text-gray-200 mt-1">Where Creativity Meets Technology</p>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <span className="inline-block px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-full mb-6">
                  Registration Now Open
                </span>
                
                <h3 className="text-3xl font-extralight text-black dark:text-white mb-6 leading-tight tracking-[-0.02em]">
                  A vibrant fusion of art, memes, pop culture & tech
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                  Spark innovation and fun with exciting activities that blend creativity and technology in unique ways.
                </p>
              </div>

              {/* Event Features - Editorial Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Main Events
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Techie's Got Talent",
                      "GIF Battle"
                    ].map((event, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-lg font-medium text-black dark:text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Special Activities
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "AI Meme Madness",
                      "Pop Culture x Data"
                    ].map((event, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2 mt-1.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Event Details */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800 mb-8">
                <h4 className="text-lg font-medium text-black dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Event Information
                </h4>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Date: 18th Sept 2025 | Time: 1:15 – 4:20 PM</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Venue: Mini Auditorium, Academic Block 1</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Presented by: Linpack Club, VIT Bhopal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial CTA */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <a
                href="https://forms.gle/LF5wK45u8qL9dxuk9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center group"
              >
                <button
                  type="button"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 font-serif font-bold text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-300 transform hover:scale-105 tracking-wide"
                >
                  Register for Event
                </button>
                <span className="ml-3 text-red-500 group-hover:translate-x-1 transition-transform text-xl">→</span>
              </a>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Limited slots available • First come, first served
              </p>
              
              {/* Student Coordinators */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="text-lg font-medium text-black dark:text-white mb-4">Student Coordinators</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="font-medium text-black dark:text-white">Naman Gurjar</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">87190 74752</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="font-medium text-black dark:text-white">Mohan Prasad</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">7305398374</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="font-medium text-black dark:text-white">Simran Ahirwar</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">9370157060</div>
                  </div>
                </div>
              </div>
              
              {/* Community Link */}
              <div className="mt-6 text-center">
                <a 
                  href="https://chat.whatsapp.com/CcaehnEJhJJE5IUzSPsm8p?mode=ac_t" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Join our WhatsApp Community
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap gap-3">
            {["#Dataverse25", "#CreativityMeetsTech", "#LinpackClub", "#VITBhopal"].map((tag) => (
              <span
                key={tag}
                className="text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Our Events Section Header - Enhanced Typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-4 lg:mb-8 max-w-4xl mx-auto"
      >
        {/* Enhanced overline text with better typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <span className="inline-block px-6 py-2 text-xs font-medium tracking-[0.3em] uppercase text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full">
            Our Collection
          </span>
        </motion.div>

        {/* Enhanced main heading with magazine-style typography */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight tracking-[-0.03em] text-black dark:text-white mb-6 leading-[0.9] font-serif max-w-5xl mx-auto">
          <span className="block lg:inline">Our</span>
          <span className="block lg:inline font-thin italic bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mt-2 lg:mt-0 lg:ml-4">
            Events
          </span>
        </h1>
        
        {/* Added subtitle for better content hierarchy */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light mt-6 max-w-2xl mx-auto leading-relaxed">
          Discover our exciting range of activities and gatherings designed to bring together enthusiasts from all backgrounds.
        </p>
      </motion.div>

      {/* Video and Book Section - Magazine Style Enhancement */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-6xl mx-auto mt-16 mb-8">
        {/* Video Section with Enhanced Styling */}
        <div className="relative w-full lg:w-1/2 h-[45vh] sm:h-[50vh] lg:h-[60vh] group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-all duration-500"></div>
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700 transform -rotate-1 group-hover:rotate-0 transition-all duration-500">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              {/* Corner Decorations */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500 rounded-br-lg"></div>
              
              {/* Video Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <Video />
              </div>
              
              {/* Overlay Title */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <h3 className="text-white font-serif font-medium text-lg">Event Highlights</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Book Section - Magazine Style Enhancement */}
        <div className="relative w-full lg:w-1/2 h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[65vh]">
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-red-200 dark:border-red-900 rounded-tl-3xl"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-red-200 dark:border-red-900 rounded-br-3xl"></div>
          
          {/* Main Container */}
          <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden">
            {/* Header with Magazine Style */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-6 py-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Club Publication</span>
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">2025</div>
              </div>
            </div>
            
            {/* Book Content */}
            <div className="h-full pt-12 pb-2 px-1">
              <div className="h-full relative rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                <BookComponent />
              </div>
            </div>
            
            {/* Footer with Magazine Style */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <div className="flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Interactive Experience
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Flip to Explore
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Button Section */}
      <div className="flex justify-center mt-2 mb-1 sm:mt-4 sm:mb-2">
        <a 
          href="/gallery"
          className="inline-flex items-center group"
        >
          <button
            type="button"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 font-serif font-bold text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 tracking-wide border-2 border-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
          >
            Explore Gallery
          </button>
          <span className="ml-3 text-red-500 group-hover:translate-x-1 transition-transform text-xl hidden sm:inline">→</span>
        </a>
      </div>

      {/* Join Our Club Section */}
      <div className="relative flex justify-center items-center w-[92vw] sm:w-[85vw] md:w-[80vw] h-auto min-h-[40vh] my-8 px-4">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300">
          <Image 
            src="/images/event2.jpg" 
            alt="Join Our Club Background" 
            fill 
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/30 rounded-lg"></div>
        </div>
        {/* Content Box */}
        <div className="absolute flex flex-col justify-center items-center inset-0 bg-white/70 dark:bg-gray-800/70 border border-transparent rounded-md z-10 gap-y-8 px-8 md:px-16 py-8 backdrop-blur-sm">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extralight tracking-[-0.02em] text-center text-gray-800 dark:text-white leading-tight">
            Join Our Club Today!
          </h1>
          <p className="font-sans text-sm sm:text-base md:text-lg text-center text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl">
            Become a member to access exclusive resources and join our community of{" "}
            <span className="font-medium text-gray-900 dark:text-white">MATLAB</span> and{" "}
            <span className="font-medium text-gray-900 dark:text-white">Overleaf</span> enthusiasts.
          </p>
          {/* Join Us Button */}
          <a href="https://forms.gle/KxZrPb5P1ySvwFQs7" 
              aria-label="Join MATLAB & Overleaf Club"
             className="mt-6 transform hover:scale-105 transition-all duration-300">
            <button
              type="button"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 font-serif font-bold text-base sm:text-lg md:text-xl text-white shadow-lg hover:shadow-xl transition duration-300 tracking-wide border-2 border-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800"
            >
              Join Us
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}