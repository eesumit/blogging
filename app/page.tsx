'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      bgImage: "bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')]",
      title: "Client Management App",
      subtitle: "Welcome to Admin/user management App.",
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      bgImage: "bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')]",
      title: "Add/Update/Remove",
      subtitle: "Add user based on role",
      color: "from-green-500/20 to-teal-500/20"
    },
    {
      bgImage: "bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')]",
      title: "Join the Community",
      subtitle: "Connect with like-minded video enthusiasts",
      color: "from-pink-500/20 to-rose-500/20"
    },
    {
      bgImage: "bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80')]",
      title: "Start Your Journey",
      subtitle: "Sign up now and unlock endless possibilities",
      color: "from-indigo-500/20 to-purple-500/20"
    }
  ];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) return;
      
      e.preventDefault();
      setIsAnimating(true);
      
      if (e.deltaY > 0 && currentSlide < slides.length - 1) {
        // Scroll down
        setCurrentSlide(prev => prev + 1);
      } else if (e.deltaY < 0 && currentSlide > 0) {
        // Scroll up
        setCurrentSlide(prev => prev - 1);
      }
      
      // Reset animation lock after transition
      setTimeout(() => setIsAnimating(false), 1000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowDown' && currentSlide < slides.length - 1) {
        e.preventDefault();
        setIsAnimating(true);
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => setIsAnimating(false), 1000);
      } else if (e.key === 'ArrowUp' && currentSlide > 0) {
        e.preventDefault();
        setIsAnimating(true);
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Hide scrollbar
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentSlide, isAnimating, slides.length]);

  // Auto scroll to current slide
  useEffect(() => {
    window.scrollTo({
      top: currentSlide * window.innerHeight,
      behavior: 'smooth'
    });
  }, [currentSlide]);

  // If already authenticated, send to /home
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/home');
    }
  }, [status, router]);

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <section 
          key={index}
          className={`absolute inset-0 h-screen w-screen transition-all duration-1000 ${
            index === currentSlide 
              ? 'opacity-100 z-10' 
              : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Parallax */}
          <div 
            className={`absolute inset-0 ${slide.bgImage} bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out ${
              index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Animated Gradient Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${slide.color} transition-all duration-1000 ${
              index === currentSlide ? 'opacity-80' : 'opacity-0'
            }`}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>

          {/* Content Container */}
          <div className="relative z-10 h-full w-full flex items-center justify-center">
            <div className={`container mx-auto px-4 text-center transition-all duration-1000 transform ${
              index === currentSlide 
                ? 'opacity-100 translate-y-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-y-20' 
                  : 'opacity-0 translate-y-20'
            }`}>
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 text-outline">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>
              
              {/* Animated CTA Button on last slide */}
              {index === slides.length - 1 && (
                <div className='flex items-center justify-center gap-3'>
                  <Button 
                    className="cursor-pointer" 
                    variant={'outline'} 
                    size={'sm'}
                    onClick={() => {
                      if (status === 'authenticated') return router.push('/home');
                      return router.push('/register');
                    }}
                  >
                    Get Started Now
                  </Button>
                  <Button 
                    className="cursor-pointer" 
                    variant={'outline'} 
                    size={'sm'} 
                    onClick={() => {
                      if (status === 'authenticated') return router.push('/home');
                      return router.push('/login');
                    }}
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Simple Arrow Indicator */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className={`transition-all duration-900 ${
          currentSlide === slides.length - 1 ? 'rotate-180' : 'rotate-0'
        }`}>
          <svg 
            className="w-4 h-4 text-white/70 animate-bounce" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
}