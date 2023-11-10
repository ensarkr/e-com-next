"use client";

import { doubleReturn } from "@/typings/globalTypes";
import { productT, sizesT } from "../server/database";
import { setMarketT } from "@/contexts/MarketContextProvider";
import { testLocalStorage } from "./localStorage";

// * Market stored permanently in the localStorage
// * And also stored as js cookie which cannot be stored permanently
// * Cookie market only sended to checkout page to prerender on that page on request

export type marketProduct = {
  uid: string;
  pid: number;
  size: sizesT;
  color: string;
};

const getMarketFromLocalStorage = (): doubleReturn<marketProduct[]> => {
  if (!testLocalStorage())
    return { status: false, message: "Storage inaccessible." };
  if (typeof window === "undefined")
    return { status: false, message: "Accessed from server." };

  const market = window.localStorage.getItem("market");
  if (market === null) {
    window.localStorage.setItem("market", JSON.stringify([]));
    return { status: true, value: [] as marketProduct[] };
  }
  return { status: true, value: JSON.parse(market) as marketProduct[] };
};

const updateLocalStorageMarket = (market: marketProduct[]) => {
  if (!testLocalStorage())
    return { status: false, message: "Storage inaccessible." };

  window.localStorage.setItem("market", JSON.stringify(market));
};

const updateCookieMarket = (market: marketProduct[]) => {
  // * path is /checkout
  document.cookie = "market=" + JSON.stringify(market) + "; Path=/checkout";
};

const removeFromMarket = (setMarket: setMarketT, marketProductUid: string) => {
  setMarket((pv) => {
    const newMarket = pv.filter((e) => e.uid !== marketProductUid);
    updateLocalStorageMarket(newMarket);
    updateCookieMarket(newMarket);
    return newMarket;
  });
};

const addToMarket = (
  setMarket: setMarketT,
  newMarketProduct: marketProduct
) => {
  setMarket((pv) => {
    const newMarket = [...pv, newMarketProduct];
    updateLocalStorageMarket(newMarket);
    updateCookieMarket(newMarket);
    return newMarket;
  });
};

const emptyMarket = (setMarket: setMarketT) => {
  setMarket((pv) => {
    const newMarket: marketProduct[] = [];
    updateLocalStorageMarket(newMarket);
    updateCookieMarket(newMarket);
    return newMarket;
  });
};

export {
  getMarketFromLocalStorage,
  updateLocalStorageMarket,
  updateCookieMarket,
  addToMarket,
  removeFromMarket,
  emptyMarket,
};
