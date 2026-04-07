"use client";

import Image from "next/image";
import { useScroll, useTransform, motion, AnimatePresence, type MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { StaticImageData } from "next/image";
import pressPics from "@/utils/parallaxImageArr";

// ---------------------------------------------------------------------------
// ParallaxImage — one image per instance so useTransform obeys Rules of Hooks.
// The parent passes its scrollYProgress MotionValue down rather than each child
// creating its own useScroll subscription.
// ---------------------------------------------------------------------------
type ParallaxImageProps = {
  src: StaticImageData;
  scaleValue: number;
  scrollYProgress: MotionValue<number>;
  index: number;
  onLoad?: () => void;
};

function ParallaxImage({ src, scaleValue, scrollYProgress, index, onLoad }: ParallaxImageProps) {
  const scale = useTransform(scrollYProgress, [0.1, 0.9], [scaleValue, 1]);

  return (
    <motion.div style={{ scale }} className="element">
      <div className="image-container">
        <Image
          src={src}
          alt=""
          fill
          placeholder="blur"
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
          sizes="100vw"
          quality={85}
          onLoad={index < 3 ? onLoad : undefined}
        />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ParallaxZoom — the scroll-linked hero section.
// ---------------------------------------------------------------------------
const scaleValues = [4, 5, 6, 7, 8, 9, 5, 6, 8, 9, 5, 6, 8];
const headerText = "KITCHEN LOVER".split(" ");

export default function ParallaxZoom() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const headerTransform1 = useTransform(scrollYProgress, [0.2, 0.5], [0, -800]);
  const headerTransform2 = useTransform(scrollYProgress, [0.2, 0.5], [0, 800]);
  const headerTransforms = [headerTransform1, headerTransform2];
  // Fade out before the x-slide finishes so wide screens don't see a lingering
  // partial word, and so the text doesn't ghost over sections below the parallax.
  const headerOpacity = useTransform(scrollYProgress, [0.3, 0.52], [1, 0]);

  useEffect(() => {
    if (loadedCount >= 3) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loadedCount]);

  const handleImageLoad = () => setLoadedCount((prev) => prev + 1);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#f5e85e] border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-[300vh] w-full relative" ref={container}>
        {headerText.map((text, index) => (
          <motion.h1
            key={index}
            className="fixed z-20 left-1/2 translate-y-90 translate-x-[-50%] text-[70px] font-[airen] text-[#f5e85e]"
            style={{ x: headerTransforms[index], top: 160 + index * 80, opacity: headerOpacity }}
          >
            {text}
          </motion.h1>
        ))}

        <div className="sticky top-0 h-screen overflow-hidden">
          {pressPics.map((src, i) => (
            <ParallaxImage
              key={i}
              src={src}
              scaleValue={scaleValues[i]}
              scrollYProgress={scrollYProgress}
              index={i}
              onLoad={handleImageLoad}
            />
          ))}
        </div>
      </div>
    </>
  );
}
