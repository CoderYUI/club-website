'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

// Register ScrollTrigger plugin only on client side
gsap.registerPlugin(ScrollTrigger)

const ProjectScroller: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const photosRef = useRef<HTMLDivElement[]>([])

  const projects = [
    {
      brand: "MATLAB Research",
      title: "Signal Processing &\nMachine Learning",
      tags: "Research, Analysis, Algorithm Development",
      image: "/images/scroller1.webp",
      color: "#7781D9"
    },
    {
      brand: "Overleaf Projects",
      title: "Academic\nPublications &\nThesis Writing",
      tags: "Documentation, LaTeX, Academic Writing",
      image: "/images/scroller2.webp",
      color: "#E67FB4"
    },
    {
      brand: "Tech Innovation",
      title: "IoT Solutions &\nEmbedded Systems",
      tags: "Hardware, Software, Integration",
      image: "/images/scroller3.webp",
      color: "#F1AB79"
    },
    {
      brand: "Data Science",
      title: "Analytics &\nVisualization Platform",
      tags: "Data Mining, Visualization, Insights",
      image: "/images/scroller4.webp",
      color: "#77A9D9"
    },
    {
      brand: "Robotics Lab",
      title: "Autonomous\nSystems &\nControl",
      tags: "Robotics, Automation, Control Systems",
      image: "/images/scroller5.webp",
      color: "#FFB08C"
    }
  ]

  const bgColors = ["#D3D6F0", "#FAE1ED", "#FFEDE0", "#E0F0FF", "#FFEAE1"]
  const bgColorsDark = ["#080808", "#3F2A37", "#3F362A", "#2A3A3F", "#080808"]

  useEffect(() => {
    const gallery = galleryRef.current
    const rightSection = rightRef.current
    
    if (!gallery || !rightSection) return

    // Only apply complex animations on desktop (768px and above)
    const isDesktop = window.innerWidth >= 768
    
    if (isDesktop) {
      // Set initial positions for all images except the first one
      const photos = photosRef.current.slice(1)
      gsap.set(photos, { yPercent: 101 })

      // Create scroll-triggered animation for desktop
      const scrollTrigger = gsap.to(photos, {
        yPercent: 0,
        stagger: 1,
        duration: 1,
        ease: "linear.inOut",
        scrollTrigger: {
          trigger: gallery,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: rightSection,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Calculate the index of the current image and update background color
            let index = Math.floor(self.progress * (bgColors.length))
            if (gallery) {
              const isDarkMode = document.documentElement.classList.contains('dark')
              const colors = isDarkMode ? bgColorsDark : bgColors
              gallery.style.backgroundColor = colors[index] || colors[colors.length - 1]
            }
          }
        }
      })

      // Button hover animations for desktop
      const buttons = gallery.querySelectorAll('.project-button')
      buttons.forEach((btn) => {
        const button = btn as HTMLElement
        const projectIndex = parseInt(button.dataset.index || '0')
        const borderColor = projects[projectIndex].color

        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            background: borderColor,
            color: "#ffffff",
            duration: 0.3,
          })
        })

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            background: "transparent",
            color: "#000000",
            duration: 0.3,
          })
        })
      })

      return () => {
        scrollTrigger.kill()
        ScrollTrigger.getAll().forEach(st => st.kill())
      }
    } else {
      // Simple mobile interactions - just basic button hover effects
      const buttons = gallery.querySelectorAll('.project-button')
      buttons.forEach((btn) => {
        const button = btn as HTMLElement
        const projectIndex = parseInt(button.dataset.index || '0')
        const borderColor = projects[projectIndex].color

        button.addEventListener('touchstart', () => {
          button.style.background = borderColor
          button.style.color = "#ffffff"
        })

        button.addEventListener('touchend', () => {
          setTimeout(() => {
            button.style.background = "transparent"
            button.style.color = "#000000"
          }, 150)
        })
      })
    }
  }, [bgColors, bgColorsDark, projects])

  return (
    <>
      {/* Desktop Version */}
      <div 
        ref={galleryRef}
        className="gallery hidden md:flex justify-center bg-[#f8f8f8] dark:bg-[#080808] min-w-full transition-colors duration-500"
      >
        {/* Left Section - Project Details */}
        <div className="left w-[30%] overflow-y-auto">
          <div className="detailsWrapper pl-8">
            {projects.map((project, index) => (
              <div key={index} className="details h-screen flex flex-col justify-center items-start w-full">
                <p 
                  className="text-sm mb-3 font-medium"
                  style={{ color: project.color }}
                >
                  {project.brand}
                </p>
                <h1 className="text-4xl mb-4 leading-[3.5rem] font-bold whitespace-pre-line text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                <p className="text-xs mb-3 text-gray-600 dark:text-gray-400">
                  {project.tags}
                </p>
                <button
                  className="project-button text-center tracking-tight mt-5 border px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 text-gray-900 dark:text-white"
                  style={{ borderColor: project.color }}
                  data-index={index}
                >
                  View More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Images */}
        <div 
          ref={rightRef}
          className="right w-[40%] h-screen flex justify-center items-center"
        >
          <div className="imgWrapper w-[400px] h-[400px] relative rounded-[50px] overflow-hidden shadow-2xl dark:shadow-gray-800/50">
            {projects.map((project, index) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) photosRef.current[index] = el
                }}
                className="images absolute w-full h-full transition-opacity duration-500"
              >
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version - Simple Stack Layout */}
      <div className="md:hidden bg-[#f8f8f8] dark:bg-[#080808] py-8 px-4">
        <div className="max-w-sm mx-auto space-y-8">
          {projects.map((project, index) => (
            <div key={index} className="mobile-project-card bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-900/50">
              {/* Project Image */}
              <div className="w-full h-48 relative rounded-xl overflow-hidden mb-4">
                <Image
                  src={project.image}
                  alt={project.brand}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
              
              {/* Project Details */}
              <div className="space-y-3">
                <p 
                  className="text-sm font-medium"
                  style={{ color: project.color }}
                >
                  {project.brand}
                </p>
                <h2 className="text-2xl font-bold leading-tight whitespace-pre-line text-gray-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.tags}
                </p>
                <button
                  className="project-button w-full text-center tracking-tight mt-4 border px-4 py-3 rounded-full transition-all duration-300 active:scale-95 text-gray-900 dark:text-white"
                  style={{ borderColor: project.color }}
                  data-index={index}
                >
                  View More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProjectScroller