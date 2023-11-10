"use client";

import {
  getMarketFromLocalStorage,
  marketProduct,
  updateCookieMarket,
  updateLocalStorageMarket,
} from "@/functions/client/market";
import React, { createContext, useContext, useEffect, useState } from "react";

const MarketContext = createContext<marketProduct[]>([]);

export type setMarketT = React.Dispatch<React.SetStateAction<marketProduct[]>>;
const SetMarketContext = createContext<setMarketT>(() => {});

export default function MarketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [market, setMarket] = useState<marketProduct[]>([]);

  useEffect(() => {
    // * pulls market from localStorage
    // * and updates context and cookies

    const market = getMarketFromLocalStorage();
    if (market.status && market.value.length !== 0) {
      setMarket(market.value);
      updateCookieMarket(market.value);
    } else {
      updateCookieMarket([]);
    }
  }, []);

  return (
    <MarketContext.Provider value={market}>
      <SetMarketContext.Provider value={setMarket}>
        {children}
      </SetMarketContext.Provider>
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const market = useContext(MarketContext);
  const setMarket = useContext(SetMarketContext);

  return { market, setMarket };
}
