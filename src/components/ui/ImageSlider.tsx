"use client";

import React, { useCallback, useEffect, useState } from "react";

export interface SliderImage {
  id: string;
  url: string;
  alt?: string | null;
}

export function ImageSlider({ images, label = "Galeri gambar" }: { images: SliderImage[]; label?: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = useCallback(() => setIndex((current) => (current + 1) % images.length), [images.length]);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = window.setInterval(next, 4500);
    return () => window.clearInterval(timer);
  }, [next, paused, images.length]);

  if (!images.length) return null;

  return (
    <div className="space-y-3" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
        {images.map((image, imageIndex) => (
          <img key={image.id} src={image.url} alt={image.alt || label} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${imageIndex === index ? "opacity-100" : "opacity-0"}`} aria-hidden={imageIndex !== index} />
        ))}
        {images.length > 1 && <>
          <button type="button" aria-label="Gambar sebelumnya" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white hover:bg-black/70">‹</button>
          <button type="button" aria-label="Gambar berikutnya" onClick={next} className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white hover:bg-black/70">›</button>
        </>}
      </div>
      {images.length > 1 && <div className="flex justify-center gap-1.5" aria-label={`${label}, ${index + 1} dari ${images.length}`}>
        {images.map((image, imageIndex) => <button key={image.id} type="button" aria-label={`Tampilkan gambar ${imageIndex + 1}`} onClick={() => setIndex(imageIndex)} className={`h-1.5 rounded-full transition-all ${imageIndex === index ? "w-6 bg-[#0D5C4D]" : "w-1.5 bg-neutral-300"} `} />)}
      </div>}
    </div>
  );
}
