"use client";

import { useEffect } from "react";

export default function NavbarBorder() {
  // * client component that used for showing  bottom navbar border when users scroll

  useEffect(() => {
    const updateNavbar = () => {
      if (window.scrollY > 1) {
        const root = document.querySelector(":root") as HTMLElement;
        if (root.style.getPropertyValue("--navbarBorderColor") !== "black")
          root.style.setProperty("--navbarBorderColor", "black");
      } else {
        const root = document.querySelector(":root") as HTMLElement;
        if (root.style.getPropertyValue("--navbarBorderColor") !== "white")
          root.style.setProperty("--navbarBorderColor", "white");
      }
    };

    document.addEventListener("scroll", updateNavbar);

    return () => {
      document.removeEventListener("scroll", updateNavbar);
    };
  }, []);

  return <></>;
}
