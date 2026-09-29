"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export default function GalleryCarousel() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Fetch images from API
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery?active=true");
        if (res.ok) {
          const json = await res.json();
          setImages(Array.isArray(json) ? json : (json.data || []));
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0 || isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length, isHovering]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (loading) {
    return (
      <div className="w-full h-80 bg-zinc-900 animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-zinc-700">Carregando galeria...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-80 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
        <ImageIcon size={48} className="mb-4 opacity-50" />
        <p>Nenhuma imagem disponível no momento.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-[400px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img) => (
          <div key={img.id} className="min-w-full h-full relative">
            <img 
              src={img.url} 
              alt={img.caption || "Galeria Barbearia"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop";
              }}
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-zinc-950 to-transparent p-6 pt-20 text-white font-medium">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-950/50 text-white flex items-center justify-center hover:bg-amber-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-zinc-950/50 text-white flex items-center justify-center hover:bg-amber-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  currentIndex === idx ? "bg-amber-500 w-6" : "bg-white/50 hover:bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
