import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import './Carousel.css';

const HomeCarousel = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Helper for guest redirect check
  const handleProtectedNavigate = (targetPath) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isHovering && images.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovering, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    clearInterval(timerRef.current);
    if (!isHovering && images.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
  };

  const goToPrev = () => {
    if (images.length === 0) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    if (images.length === 0) return;
    const newIndex = (currentIndex + 1) % images.length;
    goToSlide(newIndex);
  };

  const currentSlide = images[currentIndex] || {};

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    }),
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Floating particles for background effect
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
  }));

  return (
    <div 
      className="relative w-full h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden bg-[#0b0b0f]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-[#ff2a85]/30 to-[#e6c687]/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f]/60 via-transparent to-[#0b0b0f]/40 z-10" />

      {/* Pink Glow Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff2a85]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#e6c687]/15 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Slides Container */}
      <div className="relative w-full h-full z-10">
        <AnimatePresence initial={false} custom={1}>
          <motion.div
            key={currentIndex}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Image */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${currentSlide?.image || 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=1200&auto=format&fit=crop'})`,
                backgroundPosition: 'center 30%',
              }}
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f]/80 via-[#0b0b0f]/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center z-20">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={textVariants}
                className="max-w-3xl"
              >
                {/* New Tag */}
                <motion.div 
                  className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#ff2a85]/20 border border-[#ff2a85]/30 backdrop-blur-sm"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    borderColor: ['#ff2a85/30', '#e6c687/30', '#ff2a85/30'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs font-semibold tracking-widest text-[#e6c687] uppercase">
                    ✦ New Collection 2026 ✦
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight"
                  variants={textVariants}
                >
                  {currentSlide?.title || "Luxury HD Lace Wigs"}
                </motion.h1>

                {/* Subtitle with Gradient */}
                <motion.p 
                  className="mt-4 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl"
                  variants={textVariants}
                >
                  {currentSlide?.subtitle || "100% Virgin Human Hair with undetectable HD lace hairline."}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div 
                  className="mt-8 flex flex-wrap gap-4"
                  variants={textVariants}
                >
                  {/* SHOP NOW BUTTON */}
                  <motion.button
                    onClick={() => handleProtectedNavigate(currentSlide?.path || '/wigs/human-hair/frontal-wigs')}
                    className="group relative px-8 py-4 rounded-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 block px-6 py-2 bg-gradient-to-r from-[#ff2a85] to-[#e6c687] rounded-full font-semibold text-white text-sm tracking-wider uppercase shadow-lg shadow-[#ff2a85]/30">
                      Shop Now
                    </span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-[#e6c687] to-[#ff2a85] rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  {/* BOOK APPOINTMENT BUTTON */}
                  <motion.button
                    onClick={() => handleProtectedNavigate('/salon')}
                    className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold text-sm tracking-wider uppercase backdrop-blur-sm hover:bg-white/10 hover:border-[#ff2a85] transition-all duration-300"
                    whileHover={{ scale: 1.05, borderColor: '#ff2a85' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Appointment
                  </motion.button>
                </motion.div>

                {/* Slide Counter */}
                <motion.div 
                  className="mt-6 flex items-center space-x-3"
                  variants={textVariants}
                >
                  <span className="text-xs text-gray-400 tracking-widest">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(images.length || 1).padStart(2, '0')}
                  </span>
                  <div className="flex space-x-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-0.5 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'w-8 bg-[#ff2a85] shadow-lg shadow-[#ff2a85]/50' 
                            : 'w-4 bg-white/30 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-30 pointer-events-none">
          <motion.button
            onClick={goToPrev}
            className="pointer-events-auto p-3 rounded-full bg-[#14141e]/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#ff2a85]/20 hover:border-[#ff2a85]/50 transition-all duration-300"
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeftIcon sx={{ fontSize: 28 }} />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="pointer-events-auto p-3 rounded-full bg-[#14141e]/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#ff2a85]/20 hover:border-[#ff2a85]/50 transition-all duration-300"
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRightIcon sx={{ fontSize: 28 }} />
          </motion.button>
        </div>

        {/* Bottom Gradient Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0b0f] to-transparent z-10" />

        {/* Animated Pink Line at Bottom */}
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ff2a85] via-[#e6c687] to-[#ff2a85] z-20"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: '30%' }}
        />
      </div>
    </div>
  );
};

export default HomeCarousel;