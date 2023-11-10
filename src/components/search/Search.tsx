"use client";

import { filterObjectT } from "@/app/(main)/products/client";
import { productT, sizesT } from "@/functions/server/database";
import React, { useCallback, useEffect, useRef, useState } from "react";
import searchIcon from "@/assets/bx-search.svg";
import Image from "next/image";
import styles from "./search.module.css";
import closeIcon from "@/assets/bx-x.svg";

export default function Search({
  showSearch: showMain,
  setShowSearch: setShowMain,
  setShowFilter,
  searchText,
  setSearchText,
}: {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showMain) inputRef.current?.focus();
  }, [showMain]);

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => {
          setShowFilter(false);
          setShowMain(true);
        }}
      >
        <Image
          priority={true}
          src={searchIcon}
          alt=""
          className={styles.icon}
        ></Image>
      </button>

      <div
        className={[styles.main, showMain ? styles.showMain : ""].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          className={styles.input}
          value={searchText}
          ref={inputRef}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        ></input>

        <button
          className={styles.closeIcon}
          onClick={() => {
            setSearchText("");
            setShowMain(false);
          }}
        >
          <Image src={closeIcon} alt=""></Image>
        </button>
      </div>
    </div>
  );
}
