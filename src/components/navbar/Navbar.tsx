"use server-only";

import { productT } from "@/functions/server/database";
import { doubleReturn } from "@/typings/globalTypes";
import React, { useEffect, useState } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import MarketPart from "./marketPart/MarketPart";
import ProfilePart from "./profilePart/ProfilePart";
import NavbarBorder from "./navbarBorder/NavbarBorder";
import Image from "next/image";
import logoIcon from "@/assets/logo.svg";

export default function Navbar({
  allProducts,
}: {
  allProducts: doubleReturn<productT[]>;
}) {
  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.innerNavbar}>
          <div className={styles.navbarLinkWrapper}>
            <Link href={"/"} className={styles.navbarLink}>
              <Image
                src={logoIcon}
                alt=""
                height={"25"}
                priority={true}
              ></Image>
            </Link>
          </div>

          <div className={styles.rightPart}>
            <Link href={"/products"} className={styles.navbarLink}>
              PRODUCTS
            </Link>

            <MarketPart
              allProducts={allProducts}
              buttonClassName={styles.navbarLink}
            ></MarketPart>

            <ProfilePart buttonClassName={styles.navbarLink} />
          </div>
        </div>
      </nav>
      <NavbarBorder></NavbarBorder>
    </>
  );
}
