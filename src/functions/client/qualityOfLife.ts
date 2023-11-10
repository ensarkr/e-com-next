"use client";

const stopScrolling = () => {
  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--scroll", "hidden");
};

const starScrolling = () => {
  const root = document.querySelector(":root") as HTMLElement;
  root.style.setProperty("--scroll", "auto");
};

export { stopScrolling, starScrolling };
