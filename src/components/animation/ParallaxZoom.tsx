"use client";

import Image from "next/image";

import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import pressPics from "@/utils/parallaxImageArr";

export default function ParallaxZoom() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Hide loading screen once first 3 images are loaded
  useEffect(() => {
    if (loadedCount >= 3) {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [loadedCount]);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  const scaleValues = [4, 5, 6, 7, 8, 9, 5, 6, 8, 9, 5, 6, 8];
  const scale1 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[0], 1]);
  const scale2 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[1], 1]);
  const scale3 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[2], 1]);
  const scale4 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[3], 1]);
  const scale5 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[4], 1]);
  const scale6 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[5], 1]);
  const scale7 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[6], 1]);
  const scale8 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[7], 1]);
  const scale9 = useTransform(scrollYProgress, [0.1, 0.9], [scaleValues[8], 1]);
  const scale10 = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [scaleValues[9], 1]
  );
  const scale11 = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [scaleValues[10], 1]
  );
  const scale12 = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [scaleValues[11], 1]
  );
  const scale13 = useTransform(
    scrollYProgress,
    [0.1, 0.9],
    [scaleValues[12], 1]
  );

  const scales = [
    scale1,
    scale2,
    scale3,
    scale4,
    scale5,
    scale6,
    scale7,
    scale8,
    scale9,
    scale10,
    scale11,
    scale12,
    scale13,
  ];

  const images = pressPics.map((pic, index) => {
    return { src: pic, scale: scales[index] };
  });

  const headerText = "KITCHEN LOVER".split(" ");

  const headerTransform1 = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    [0, -1000]
  );
  const headerTransform2 = useTransform(scrollYProgress, [0.2, 0.5], [0, 1000]);
  const headerTransforms = [headerTransform1, headerTransform2];

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
        {headerText.map((text, index) => {
          return (
            <motion.h1
              className="fixed z-20 left-1/2 translate-y-90 translate-x-[-50%] text-[70px] font-[airen] text-[#f5e85e]"
              style={{
                x: headerTransforms[index],
                top: 160 + index * 80,
              }}
              key={index}
            >
              {text}
            </motion.h1>
          );
        })}
        <div className="sticky top-0 h-screen overflow-hidden">
          {images.map(({ src, scale }, index) => {
            return (
              <motion.div
                style={{ scale: scale }}
                key={`para-zoom-${index}`}
                className="element"
              >
                <div className="image-container">
                  <Image
                    src={src}
                    alt="image"
                    fill
                    placeholder="blur"
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                    sizes="100vw"
                    quality={85}
                    onLoad={index < 3 ? handleImageLoad : undefined}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
