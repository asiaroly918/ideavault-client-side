import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Turn Ideas into Impact',
    subtitle:
      'Discover bold startup concepts, share your own, and build the future with a community that cares.',
    image: 'https://i.ibb.co/hKJ0w5T/slide-1.jpg',
    cta: 'Explore Ideas',
  },
  {
    id: 2,
    title: 'Validate with Real People',
    subtitle:
      'Get honest feedback, find co-founders, and refine your business model before you build.',
    image: 'https://i.ibb.co/6JmPv7s/slide-2.jpg',
    cta: 'Join the Community',
  },
  {
    id: 3,
    title: 'Spot the Next Big Thing',
    subtitle:
      'Browse trending ideas across Tech, Health, AI, Education, and more.',
    image: 'https://i.ibb.co/vq0FYY6/slide-3.jpg',
    cta: 'See Trending',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[520px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-100/95 via-base-100/70 to-transparent" />
          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-2xl space-y-6">
              <span className="badge badge-primary badge-lg">Startup Spotlight</span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-base-content/80">
                {slide.subtitle}
              </p>
              <div>
                <Link
                  href="/ideas"
                  className="btn btn-primary btn-lg shadow-lg shadow-primary/30"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === current ? 'bg-primary w-8' : 'bg-base-content/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
