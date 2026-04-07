"use client";

import { useAppSelector } from "@/store/hooks/reduxHooks";
import MenuButton from "@/components/buttons/MenuButton";
import Menu from "@/components/structural/Menu";
import { AnimatePresence } from "framer-motion";
import kitchenLogo from "@/assets/images/kitchen_logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import silverSequins from "../../assets/images/silver_sequins.jpg";

export default function Header() {
  const menuIsOpen = useAppSelector((state) => state.menu.isOpen);

  const router = useRouter();

  return (
    <div className="absolute z-100 w-screen h-20 flex justify-center">
      <Image
        src={silverSequins}
        alt="sequin background"
        fill
        className="object-cover"
        style={{ zIndex: 0 }}
      />
      <div
        className="absolute top-[50%] left-[50%] translate-[-50%] z-30 h-18 w-9/10 flex items-center justify-between px-5 rounded-[90px] backdrop-blur-[1px] shadow-md shadow-black/30 border-[#ffffff35] border-[1px] "
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0))",
        }}>
        <button
          className="cursor-pointer flex justify-center items-center"
          onClick={() => router.push("/")}>
          <Image
            src={kitchenLogo.src}
            alt="kitchen lover"
            width={80}
            height={80}
          />
        </button>
        <MenuButton pos={{ x: "83%", y: 20 }} />
      </div>
      <AnimatePresence>{menuIsOpen && <Menu />}</AnimatePresence>
    </div>
  );
}
