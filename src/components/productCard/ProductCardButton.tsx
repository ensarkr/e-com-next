"use client";

import Link from "next/link";
import styles from "./productCard.module.css";
import React from "react";

export default function ProductCardButton() {
  return (
    <>
      <Link href={"/products"} className={styles.card}>
        <div className={[styles.front, styles.productCardButton].join(" ")}>
          <p>All Products</p>
        </div>
      </Link>
    </>
  );
}
