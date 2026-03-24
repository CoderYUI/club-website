"use client"

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-3xl bg-transparent rounded-2xl flex flex-col items-center"
          >
            <div className="w-full flex justify-end mb-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md transition-colors"
                aria-label="Close popup"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-video bg-black/50 rounded-xl overflow-hidden shadow-2xl flex flex-col">
              <div className="relative w-full flex-grow">
                <Image 
                  src="/images/hackmatrix.png"
                  alt="HackMatrix Upcoming Event"
                  fill
                  className="object-contain"
                  priority
                />
              </div>


            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
