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

  // Touch Swipe for Mobile Navigation
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40;

  const activeImage = allImages[currentImageIndex] || product.imageUrl || '';
  const frames = product.threeSixtyFrames && product.threeSixtyFrames.length > 0
    ? product.threeSixtyFrames
    : allImages;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && allImages.length > 1) {
      handleNextImage();
    }
    if (isRightSwipe && allImages.length > 1) {
      handlePrevImage();
    }
  };

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
    <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 w-full relative">
      {/* Thumbnails Strip - Desktop Left Vertical, Mobile/Tablet Bottom Horizontal */}
      {(allImages.length > 1 || Boolean(product.threeSixtyFrames && product.threeSixtyFrames.length > 0) || Boolean(product.videoUrl && product.videoUrl.trim())) && (
        <div className="order-2 xl:order-1 flex xl:flex-col gap-2 sm:gap-3 overflow-x-auto xl:overflow-y-auto max-h-[520px] scrollbar-none py-1 px-0.5 justify-start">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveMedia('image');
                setCurrentImageIndex(idx);
              }}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 xl:w-20 xl:h-20 rounded-xl sm:rounded-2xl border-2 overflow-hidden bg-slate-50 transition-all cursor-pointer p-1 sm:p-1.5 ${activeMedia === 'image' && currentImageIndex === idx
                ? 'border-brand-primary ring-2 sm:ring-4 ring-brand-primary/15 scale-95 shadow-md'
                : 'border-slate-200/80 hover:border-slate-300 hover:scale-100 opacity-75 hover:opacity-100'
                }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}

          {/* 360 Frame Toggle Thumbnail */}
          {product.threeSixtyFrames && product.threeSixtyFrames.length > 0 && (
            <button
              onClick={() => setActiveMedia('360')}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 xl:w-20 xl:h-20 rounded-xl sm:rounded-2xl border-2 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center transition-all cursor-pointer ${activeMedia === '360'
                ? 'border-indigo-600 ring-2 sm:ring-4 ring-indigo-600/15 scale-95 shadow-md'
                : 'border-slate-200 hover:border-indigo-300'
                }`}
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 animate-spin-slow" />
              <span className="text-[8px] sm:text-[10px] font-black text-indigo-700 mt-0.5 sm:mt-1 uppercase tracking-tighter">360°</span>
            </button>
          )}

          {/* Video Mode Thumbnail */}
          {product.videoUrl && product.videoUrl.trim() && (
            <button
              onClick={() => setActiveMedia('video')}
              className={`relative flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 xl:w-20 xl:h-20 rounded-xl sm:rounded-2xl border-2 overflow-hidden bg-brand-lightest flex flex-col items-center justify-center transition-all cursor-pointer ${activeMedia === 'video'
                ? 'border-brand-primary ring-2 sm:ring-4 ring-brand-primary/15 scale-95 shadow-md'
                : 'border-slate-200 hover:border-brand-light'
                }`}
            >
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-sm">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white ml-0.5" />
              </div>
              <span className="text-[8px] sm:text-[10px] font-black text-brand-primary mt-0.5 sm:mt-1 uppercase tracking-tighter">Video</span>
            </button>
          )}
        </div>
      )}

      {/* Main Showcase Stage */}
      <div className="order-1 xl:order-2 flex-1 relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-slate-50/70 to-white border border-slate-200/80 p-2 sm:p-6 lg:p-8 flex items-center justify-center shadow-xs w-full aspect-square sm:aspect-[4/3] xl:aspect-auto xl:min-h-[480px] xl:max-h-[540px] overflow-hidden">

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[65%]">
          {product.discountPercentage && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-primary text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-md flex items-center gap-1 sm:gap-1.5 border border-white/20"
            >
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>SAVE {product.discountPercentage}%</span>
            </motion.div>
          )}
          {product.isVerifiedOfficialStore && (
            <div className="bg-emerald-600 text-white text-[9px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Official Brand Store</span>
            </div>
          )}
        </div>

        {/* Floating Controls */}
        <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2">
          {activeMedia === 'image' && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-slate-700 hover:text-brand-primary hover:bg-white shadow-sm transition-all cursor-pointer active:scale-95"
              title="Fullscreen Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Floating Prev / Next Arrows on Main Image */}
        {activeMedia === 'image' && allImages.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-brand-primary hover:bg-white transition-all cursor-pointer active:scale-90"
              title="Previous Image"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-brand-primary hover:bg-white transition-all cursor-pointer active:scale-90"
              title="Next Image"
              aria-label="Next Image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Bottom Right Image Counter Badge */}
        {activeMedia === 'image' && allImages.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-20 bg-slate-900/75 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm pointer-events-none">
            {currentImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Mobile Pagination Indicator Dots */}
        {activeMedia === 'image' && allImages.length > 1 && (
          <div className="xl:hidden absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/75 backdrop-blur-md px-2 py-1 rounded-full shadow-2xs border border-slate-200/60">
            {allImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`transition-all rounded-full ${
                  currentImageIndex === idx ? 'w-4 h-1.5 bg-brand-primary' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Jump to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Media Viewport */}
        {activeMedia === 'image' && (
          <div
            ref={imageContainerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full h-full flex items-center justify-center cursor-pointer select-none overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Base Image */}
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={activeImage}
              alt={product.title}
              className="w-full h-full max-h-[92%] object-contain pointer-events-none p-1 sm:p-2"
            />

            {/* Hover Lens Rectangle (Desktop Only) */}
            {isHovered && (
              <div
                className="hidden lg:block absolute w-32 h-32 border-2 border-brand-primary bg-brand-primary/10 backdrop-blur-[1px] pointer-events-none z-30 shadow-xs"
                style={{
                  left: `${lensPos.x}px`,
                  top: `${lensPos.y}px`,
                }}
              />
            )}

            {/* FLOATING RIGHT ZOOM PREVIEWER (Desktop Only) */}
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
              className="max-h-[85%] w-auto object-contain"
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
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-8"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 sm:p-3 rounded-full transition-all cursor-pointer z-50"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full transition-all cursor-pointer z-50"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full transition-all cursor-pointer z-50"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center gap-4 sm:gap-6 w-full">
              <img
                src={activeImage}
                alt={product.title}
                className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="flex gap-2 sm:gap-3 overflow-x-auto p-2 bg-white/10 rounded-2xl backdrop-blur-md max-w-full scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden p-1 bg-white/5 transition-all cursor-pointer shrink-0 ${
                      currentImageIndex === idx ? 'border-brand-primary scale-105' : 'border-white/20 opacity-60'
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