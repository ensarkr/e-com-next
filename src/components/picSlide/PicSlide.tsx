"use client";

import { useEffect, useState } from "react";
import styles from "./picSlide.module.css";
import ChangingFonts from "./changingFonts/ChangingFonts";
import Image from "next/image";
import hor1 from "@/assets/hor1.jpg";
import hor2 from "@/assets/hor2.jpg";
import hor3 from "@/assets/hor3.jpg";
import ver1 from "@/assets/ver1.jpg";
import ver2 from "@/assets/ver2.jpg";
import ver3 from "@/assets/ver3.jpg";

export default function PicSlide() {
  // * presentation
  // * on pcs it changes pics depending on scroll position
  // * on mobile it changes every 2 second
  // * all pics are starts to load when component mounts to seamlessly switch between them

  const [orientation, setOrientation] = useState<"wide" | "tall">("wide");
  const [slideType, setSlideType] = useState<"scroll" | "time">("scroll");
  const [slidePosition, setSlidePosition] = useState<"fixed" | "absolute">(
    "fixed"
  );
  const isMobile = slideType === "time";
  const [activeImg, setActiveImg] = useState(1);

  useEffect(() => {
    const isMobileRecent = /Android|iPhone/i.test(navigator.userAgent);

    const getOrientation = () =>
      window.innerHeight / window.innerWidth > 1.2 ? "tall" : "wide";

    const correctOrientation = () => {
      setOrientation(getOrientation());
    };

    correctOrientation();

    if (isMobileRecent) {
      setSlideType("time");
      setSlidePosition("absolute");

      const slideInterval = setInterval(() => {
        setActiveImg((pv) => ((pv + 1) % 3) + 1);
      }, 2000);

      window.addEventListener("resize", correctOrientation);

      return () => {
        clearInterval(slideInterval);
        window.removeEventListener("resize", correctOrientation);
      };
    } else {
      setSlidePosition("fixed");

      const getImageNumber = () => {
        if (window.scrollY > window.innerHeight) return 3;
        else if (window.scrollY > window.innerHeight * (50 / 100)) return 2;
        else return 1;
      };

      const correctAll = () => {
        correctOrientation();
        setActiveImg(getImageNumber());
        if (window.scrollY > window.innerHeight) {
          setSlidePosition("absolute");
        } else {
          setSlidePosition("fixed");
        }
      };

      document.addEventListener("scroll", correctAll);
      window.addEventListener("resize", correctAll);

      return () => {
        document.removeEventListener("scroll", correctAll);
        window.removeEventListener("resize", correctAll);
      };
    }
  }, []);

  const shouldShowImage = (
    imgNumber: number,
    imgOrientation: "tall" | "wide",
    activeImg: number,
    orientation: "tall" | "wide"
  ) => {
    if (activeImg === imgNumber && orientation === imgOrientation) return true;
    else return false;
  };

  return (
    <>
      <div
        className={
          slideType === "time" ? styles.containerTime : styles.containerScroll
        }
      >
        <div
          className={
            slidePosition === "absolute"
              ? styles.sliderAbsolute
              : styles.sliderFixed
          }
        >
          <div className={styles.sliderText}>
            <ChangingFonts text={"LIFE IS TOO"}></ChangingFonts>
            <ChangingFonts text={"SHORT TO WEAR"}></ChangingFonts>
            <ChangingFonts text={"BORING CLOTHES"}></ChangingFonts>
          </div>
          <div className={styles.imgDivs}>
            <div
              className={[
                styles.imgDiv,
                shouldShowImage(1, "wide", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 30 : 80}
                src={hor1}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>
                {"photographer Hatice Baran"}
              </div>
            </div>
            <div
              className={[
                styles.imgDiv,
                shouldShowImage(2, "wide", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 30 : 80}
                src={hor2}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>
                {"photographer Anna Shvets"}
              </div>
            </div>
            <div
              className={[
                styles.imgDiv,
                shouldShowImage(3, "wide", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 30 : 80}
                src={hor3}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>
                {"photographer Clem Onojeghuo"}
              </div>
            </div>

            <div
              className={[
                styles.imgDiv,
                shouldShowImage(1, "tall", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 30 : 80}
                src={ver1}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>{"photographer Vova Kras"}</div>
            </div>

            <div
              className={[
                styles.imgDiv,
                shouldShowImage(2, "tall", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 50 : 80}
                src={ver2}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>
                {"photographer Amina Filkins"}
              </div>
            </div>
            <div
              className={[
                styles.imgDiv,
                shouldShowImage(3, "tall", activeImg, orientation)
                  ? styles.showImage
                  : "",
              ].join(" ")}
            >
              <Image
                quality={isMobile ? 50 : 80}
                src={ver3}
                alt=""
                className={styles.image}
              ></Image>
              <div className={styles.imgDivSrc}>
                {"photographer cottonbro studio"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
