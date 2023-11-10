"use client";

import styles from "./footer.module.css";
import Image from "next/image";
import mailIcon from "@/assets/envelope-regular-24.png";
import githubIcon from "@/assets/github-logo-24.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.innerFooter}>
        <div>
          <h3>ABOUT</h3>
          <p>
            This e-commerce site fully developed by me. You can check git-hub
            repository to learn which technologies I used to develop this site.
          </p>
        </div>
        <div>
          <h3>CONTACT</h3>
          <button
            onClick={() => {
              window.open("mailto:eyupensarkara@gmail.com", "blank");
            }}
            title="eyupensarkara@gmail.com"
          >
            <Image src={mailIcon} alt=""></Image>
          </button>
          <button
            onClick={() => {
              window.open("https://github.com/ensarkr/e-com-next", "blank");
            }}
          >
            <Image src={githubIcon} alt=""></Image>
          </button>
        </div>
      </div>
    </footer>
  );
}
