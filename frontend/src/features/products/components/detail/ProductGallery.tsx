'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Play, RefreshCw, ChevronLeft, ChevronRight, ShieldCheck, Tag, X } from 'lucide-react';
import { ProductDetailItem } from '@/lib/products-data';

interface ProductGalleryProps {
  product: ProductDetailItem;
  selectedColorImage?: string;
}

export function ProductGallery({ product, selectedColorImage }: ProductGalleryProps) {
  const rawList = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages.filter(Boolean)
    : (product.imageUrl ? [product.imageUrl] : []);

  const allImages = selectedColorImage
    ? [selectedColorImage, ...rawList.filter((img) => img !== selectedColorImage)]
    : rawList;

  const [activeMedia, setActiveMedia] = useState<'image' | '360' | 'video'>('image');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [threeSixtyFrame, setThreeSixtyFrame] = useState(0);

  // Lens & Magnifier States
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activeImage = allImages[currentImageIndex] || product.imageUrl || '';
  const frames = product.threeSixtyFrames && product.threeSixtyFrames.length > 0
    ? product.threeSixtyFrames
    : allImages;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();

    // Lens size (e.g., 128px x 128px)
    const lensWidth = 128;
    const lensHeight = 128;

    // Calculate cursor position relative to container
    let mouseX = e.clientX - left;
    let mouseY = e.clientY - top;

    // Constrain lens inside container bounds
    let x = mouseX - lensWidth / 2;
    let y = mouseY - lensHeight / 2;

    if (x < 0) x = 0;
    if (x > width - lensWidth) x = width - lensWidth;
    if (y < 0) y = 0;
    if (y > height - lensHeight) y = height - lensHeight;

    // Background offset percentage for zoomed box
    const bgX = (x / (width - lensWidth)) * 100;
    const bgY = (y / (height - lensHeight)) * 100;

    setLensPos({ x, y });
    setBgPos({ x: bgX, y: bgY });
  };

  const handle360Drag = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setThreeSixtyFrame((prev) => (prev + 1) % frames.length);
    } else {
      setThreeSixtyFrame((prev) => (prev - 1 + frames.length) % frames.length);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4 w-full relative">
      {/* Thumbnails Strip - Desktop Left Vertical, Mobile Bottom Horizontal */}
      {(allImages.length > 1 || Boolean(product.threeSixtyFrames && product.threeSixtyFrames.length > 0) || Boolean(product.videoUrl && product.videoUrl.trim())) && (
        <div className="order-2 xl:order-1 flex xl:flex-col gap-3 overflow-x-auto xl:overflow-y-auto max-h-[520px] scrollbar-none py-1 px-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveMedia('image');
                setCurrentImageIndex(idx);
              }}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-slate-50 transition-all cursor-pointer p-1.5 ${activeMedia === 'image' && currentImageIndex === idx
                ? 'border-brand-primary ring-4 ring-brand-primary/15 scale-95 shadow-md'
                : 'border-slate-200/80 hover:border-slate-300 hover:scale-100 opacity-80 hover:opacity-100'
                }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}

          {/* 360 Frame Toggle Thumbnail */}
          {product.threeSixtyFrames && product.threeSixtyFrames.length > 0 && (
            <button
              onClick={() => setActiveMedia('360')}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center transition-all cursor-pointer ${activeMedia === '360'
                ? 'border-indigo-600 ring-4 ring-indigo-600/15 scale-95 shadow-md'
                : 'border-slate-200 hover:border-indigo-300'
                }`}
            >
              <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin-slow" />
              <span className="text-[10px] font-black text-indigo-700 mt-1 uppercase tracking-tighter">360° View</span>
            </button>
          )}

          {/* Video Mode Thumbnail */}
          {product.videoUrl && product.videoUrl.trim() && (
            <button
              onClick={() => setActiveMedia('video')}
              className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-brand-lightest flex flex-col items-center justify-center transition-all cursor-pointer ${activeMedia === 'video'
                ? 'border-brand-primary ring-4 ring-brand-primary/15 scale-95 shadow-md'
                : 'border-slate-200 hover:border-brand-light'
                }`}
            >
              <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
              <span className="text-[10px] font-black text-brand-primary mt-1 uppercase tracking-tighter">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Main Showcase Stage */}
      <div className="order-1 xl:order-2 flex-1 relative rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 p-4 sm:p-8 flex items-center justify-center shadow-xs min-h-[380px] sm:min-h-[480px]">

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
          {product.discountPercentage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-primary text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/20"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>SAVE {product.discountPercentage}% OFF</span>
            </motion.div>
          )}
          {product.isVerifiedOfficialStore && (
            <div className="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Brand Store</span>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {activeMedia === 'image' && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 hover:text-brand-primary hover:bg-white shadow-sm transition-all cursor-pointer"
              title="Fullscreen Lightbox"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Media Viewport */}
        {activeMedia === 'image' && (
          <div
            ref={imageContainerRef}
            className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center cursor-crosshair select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Base Image */}
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={activeImage}
              alt={product.title}
              className="max-h-[400px] w-auto object-contain pointer-events-none"
            />

            {/* Hover Lens Rectangle */}
            {isHovered && (
              <div
                className="hidden lg:block absolute w-32 h-32 border-2 border-brand-primary bg-brand-primary/10 backdrop-blur-[1px] pointer-events-none z-30 shadow-xs"
                style={{
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {/* FLOATING RIGHT ZOOM PREVIEWER (Overlaps Details Column) */}
            {isHovered && (
              <div
                className="hidden lg:block absolute left-[103%] top-0 z-50 w-[820px] h-[620px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden pointer-events-none"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                  backgroundSize: '280%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
          </div>
        )}

        {/* 360 Rotation Mode */}
        {activeMedia === '360' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <motion.img
              key={threeSixtyFrame}
              src={frames[threeSixtyFrame]}
              alt="360 view"
              className="max-h-[650px] w-auto object-contain"
            />
            <div className="absolute bottom-4 flex items-center gap-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-md">
              <button
                onClick={() => handle360Drag('left')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                Frame {threeSixtyFrame + 1} / {frames.length}
              </span>
              <button
                onClick={() => handle360Drag('right')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Video Mode */}
        {activeMedia === 'video' && product.videoUrl && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <iframe
              src={product.videoUrl}
              title="Product Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center gap-6">
              <img
                src={activeImage}
                alt={product.title}
                className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
              <div className="flex gap-3 overflow-x-auto p-2 bg-white/10 rounded-2xl backdrop-blur-md">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-white/5 transition-all cursor-pointer ${currentImageIndex === idx ? 'border-brand-primary scale-105' : 'border-white/20 opacity-60'
                      }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}