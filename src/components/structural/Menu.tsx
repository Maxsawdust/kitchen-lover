"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks/reduxHooks";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toggleMenu } from "@/store/reducers/menuReducer";

export default function Menu() {
  const [centerPoint, setCenterPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const buttonRect = useAppSelector((state) => state.menu.buttonRect);
  const dispatch = useAppDispatch();

  const pathname = usePathname();

  useEffect(() => {
    if (buttonRect) {
      const centerX = buttonRect.left + buttonRect.width / 2;
      const centerY = buttonRect.top + buttonRect.height / 2;
      setCenterPoint({ x: centerX, y: centerY });
    }
  }, [buttonRect]);

  useEffect(() => {
    // Prevent body scroll when menu is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const closeMenu = () => {
    dispatch(toggleMenu());
  };

  if (!centerPoint) return null;

  return (
    <motion.div
      initial={{
        clipPath: `circle(0% at ${centerPoint.x}px ${centerPoint.y}px)`,
      }}
      animate={{
        clipPath: `circle(150% at ${centerPoint.x}px ${centerPoint.y}px)`,
      }}
      exit={{
        clipPath: `circle(0% at ${centerPoint.x}px ${centerPoint.y}px)`,
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-screen w-screen px-15 py-30 flex flex-col gap-10 text-4xl bg-kitchen-red z-30">
      <div
        className={`w-2/3 py-2 flex justify-between items-center ${
          pathname === "/" ? "border-b-3 border-black" : ""
        }`}>
        <Link onClick={closeMenu} href="/">
          Home
        </Link>
      </div>

      <div
        className={`w-2/3 py-2 flex justify-between items-center ${
          pathname === "/shop" ? "border-b-3 border-black" : ""
        }`}>
        <Link
          onClick={closeMenu}
          href="https://kitchenlover.bandcamp.com/merch"
          target="_blank"
          rel="noopener noreferrer">
          Shop
        </Link>
      </div>

      {/* <div
        className={`w-2/3 py-2 flex justify-between items-center ${
          pathname === "/about" ? "border-b-3 border-black" : ""
        }`}>
        <Link onClick={closeMenu} href="/about">
          About
        </Link>
      </div> */}

      <div
        className={`w-2/3 py-2 flex justify-between items-center ${
          pathname === "/music" ? "border-b-3 border-black" : ""
        }`}>
        <Link onClick={closeMenu} href="/music">
          Music
        </Link>
      </div>

      <div
        className={`w-2/3 py-2 flex justify-between items-center ${
          pathname === "/video" ? "border-b-3 border-black" : ""
        }`}>
        <Link onClick={closeMenu} href="/video">
          Videos
        </Link>
      </div>
    </motion.div>
  );
}
