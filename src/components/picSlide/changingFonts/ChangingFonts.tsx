"use client";

import { useEffect, useState, memo, useRef } from "react";

export default function ChangingFonts({ text }: { text: string }) {
  // * slices every letter
  // * puts them in spans
  // * and change their fonts randomly

  const wordRef = useRef<null | HTMLParagraphElement>(null);

  useEffect(() => {
    let intervalTime = 700;
    const target = wordRef.current;

    if (target !== null) {
      const change = () => {
        target.innerHTML = "";

        let fontArray = [
          "font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;",
          "font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif, 'Arial Narrow', Arial, sans-serif;",
          "font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;",
          "font-family: 'Courier New', Courier, monospace;",
        ];

        for (let i = 0; i < text.length; i++) {
          let font = Math.floor(Math.random() * 4);
          target.innerHTML += `<span style=\"  ${fontArray[font]}\">${text[i]}</span>`;
        }
      };

      change();

      const fontInterval = setInterval(() => {
        setTimeout(() => {
          change();
        }, Math.random() * intervalTime);
      }, intervalTime);

      return () => {
        clearInterval(fontInterval);
      };
    }
  }, [text]);

  return <p ref={wordRef}>{text}</p>;
}
