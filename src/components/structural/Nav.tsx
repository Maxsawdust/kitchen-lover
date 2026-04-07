"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks/reduxHooks";
import { toggleMenu, setButtonRect } from "@/store/reducers/menuReducer";
import kitchenLogo from "@/assets/images/kitchen_logo.png";

// ---------------------------------------------------------------------------
// Desktop nav links
// ---------------------------------------------------------------------------
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music" },
  { label: "Videos", href: "/video" },
  { label: "Shop", href: "https://kitchenlover.bandcamp.com/merch", external: true },
];

// ---------------------------------------------------------------------------
// Nav — renders a full-width desktop bar (md+) and a floating hamburger on
// mobile, with the existing radial clip-path menu overlay.
// ---------------------------------------------------------------------------
export default function Nav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const menuIsOpen = useAppSelector((state) => state.menu.isOpen);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Keep Redux rect in sync so the radial animation originates from the button.
  useEffect(() => {
    const updateRect = () => {
      if (buttonRef.current) {
        dispatch(setButtonRect(buttonRef.current.getBoundingClientRect().toJSON()));
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  });

  const close = () => dispatch(toggleMenu());

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Desktop bar — visible md+                                           */}
      {/* ------------------------------------------------------------------ */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 items-center justify-between px-10 bg-[#1a1a1a]/90 backdrop-blur-sm border-b border-white/10">
        <Link href="/" className="flex items-center">
          <Image src={kitchenLogo} alt="Kitchen Lover" width={52} height={52} />
        </Link>

        <div className="flex items-center gap-8 text-sm uppercase tracking-widest font-semibold">
          {navLinks.map(({ label, href, external }) => {
            const isActive = !external && pathname === href;
            return (
              <Link
                key={href}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={`transition-colors hover:text-kitchen-pink pb-0.5 ${
                  isActive
                    ? "text-kitchen-pink border-b border-kitchen-pink"
                    : "text-white/80"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile hamburger — visible below md                                 */}
      {/* ------------------------------------------------------------------ */}
      <button
        ref={buttonRef}
        aria-label="Open menu"
        aria-expanded={menuIsOpen}
        className="md:hidden fixed top-4 right-5 z-50 h-12 w-12 p-2 cursor-pointer text-white rounded-full"
        onClick={() => dispatch(toggleMenu())}
      >
        <GiHamburgerMenu className="h-full w-full drop-shadow-[0_0_1px_black]" />
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile radial overlay menu                                          */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {menuIsOpen && <MobileMenu pathname={pathname} onClose={close} />}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// MobileMenu — the full-screen radial reveal, mobile only.
// ---------------------------------------------------------------------------
function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const buttonRect = useAppSelector((state) => state.menu.buttonRect);

  const centerX = buttonRect ? buttonRect.left + buttonRect.width / 2 : 0;
  const centerY = buttonRect ? buttonRect.top + buttonRect.height / 2 : 0;

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      initial={{ clipPath: `circle(0% at ${centerX}px ${centerY}px)` }}
      animate={{ clipPath: `circle(150% at ${centerX}px ${centerY}px)` }}
      exit={{ clipPath: `circle(0% at ${centerX}px ${centerY}px)` }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 flex flex-col gap-10 px-10 py-24 text-4xl bg-kitchen-red"
    >
      {navLinks.map(({ label, href, external }) => (
        <div
          key={href}
          className={`w-2/3 py-2 border-b-2 ${
            !external && pathname === href ? "border-black" : "border-transparent"
          }`}
        >
          <Link
            href={href}
            onClick={onClose}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {label}
          </Link>
        </div>
      ))}
    </motion.div>
  );
}
