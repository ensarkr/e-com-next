"use client";

import { useMarket } from "@/contexts/MarketContextProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./market.module.css";
import { starScrolling, stopScrolling } from "@/functions/client/qualityOfLife";
import closeIcon from "@/assets/bx-x.svg";
import trashIcon from "@/assets/bx-trash.svg";
import Image from "next/image";
import PricePart from "@/components/pricePart/PricePart";
import { productT } from "@/functions/server/database";
import { doubleReturn } from "@/typings/globalTypes";
import { removeFromMarket } from "@/functions/client/market";
import { LinkButton } from "@/components/buttons/Buttons";
import { usePathname } from "next/navigation";
import bagIcon from "@/assets/bag-shopping-solid.svg";

export default function MarketPart({
  allProducts,
  buttonClassName,
}: {
  allProducts: doubleReturn<productT[]>;
  buttonClassName: string;
}) {
  const { market, setMarket } = useMarket();
  const [showMarket, setShowMarket] = useState(false);

  const pathname = usePathname();
  // * pathName used for not showing market when users on checkout page

  const { oldPriceSum, priceSum } = useMemo(() => {
    if (!allProducts.status) {
      return {
        oldPriceSum: null,
        priceSum: 0,
      };
    }

    let priceSum = 0;
    let oldPriceSum = 0;

    market.map((e) => {
      const currentProduct = allProducts.value.filter(
        (product) => e.pid === product.id
      )[0];

      priceSum += currentProduct.price;
      oldPriceSum += currentProduct.oldPrice
        ? currentProduct.oldPrice
        : currentProduct.price;
    });
    return {
      oldPriceSum: oldPriceSum === 0 ? null : oldPriceSum,
      priceSum,
    };
  }, [market]);

  const itemCount = useMemo(() => {
    if (market.length > 9) return "+";
    else if (market.length === 0) return null;
    return market.length;
  }, [market]);

  const openMarketSidebar = useCallback(() => {
    setShowMarket(true);
    stopScrolling();
  }, []);

  const closeMarketSidebar = useCallback(() => {
    setShowMarket(false);
    starScrolling();
  }, []);

  return (
    <>
      {!pathname.endsWith("checkout") && (
        <button
          className={[buttonClassName, styles.openButton].join(" ")}
          onClick={() => {
            openMarketSidebar();
          }}
        >
          <Image src={bagIcon} alt="" priority={true}></Image>
          {itemCount !== null && (
            <div className={styles.itemCount}>{itemCount}</div>
          )}
        </button>
      )}

      <div
        className={[styles.market, showMarket ? styles.showMarket : ""].join(
          " "
        )}
      >
        {showMarket && (
          <>
            <div className={styles.topPart}>
              <h3 className={styles.title}>MARKET</h3>

              <button
                className={styles.marketButton}
                onClick={() => {
                  closeMarketSidebar();
                }}
              >
                <Image src={closeIcon} alt="close button"></Image>
              </button>
            </div>
            <ul
              className={[
                styles.itemsContainer,
                market.length === 0 || !allProducts.status
                  ? styles.emptyMarket
                  : "",
              ].join(" ")}
            >
              {market.length === 0
                ? "It seems like market is empty."
                : !allProducts.status
                ? allProducts.message
                : market.map((e) => {
                    const currentProduct = allProducts.value.filter(
                      (product) => e.pid === product.id
                    )[0];

                    return (
                      <li key={e.uid} className={styles.item}>
                        <div className={styles.itemTop}>
                          <h4 className={styles.title}>
                            {currentProduct.name}
                          </h4>
                          <button
                            className={styles.marketButton}
                            onClick={() => {
                              removeFromMarket(setMarket, e.uid);
                            }}
                          >
                            <Image src={trashIcon} alt="remove icon"></Image>
                          </button>
                        </div>
                        <div className={styles.itemBottom}>
                          <div className={styles.choices}>
                            <div>
                              size {currentProduct.hasSizes ? e.size : "N/A"}
                            </div>
                            <div className={styles.colorDiv}>
                              color
                              <div
                                className={styles.colorBox}
                                style={{ backgroundColor: e.color }}
                              ></div>
                            </div>
                          </div>

                          <PricePart
                            oldPrice={currentProduct.oldPrice}
                            price={currentProduct.price}
                          ></PricePart>
                        </div>
                      </li>
                    );
                  })}
            </ul>
          </>
        )}

        {market.length > 0 && (
          <div
            className={[
              styles.bottomPart,
              showMarket ? styles.showMarket : "",
            ].join(" ")}
          >
            {showMarket && (
              <>
                <PricePart oldPrice={oldPriceSum} price={priceSum}></PricePart>
                <LinkButton
                  href="/checkout"
                  title="CHECKOUT"
                  prefetch={false}
                  onClick={() => {
                    closeMarketSidebar();
                  }}
                ></LinkButton>
              </>
            )}
          </div>
        )}
      </div>

      {showMarket && (
        <div
          className={[styles.fullScreen].join(" ")}
          onClick={() => {
            closeMarketSidebar();
          }}
        ></div>
      )}
    </>
  );
}
