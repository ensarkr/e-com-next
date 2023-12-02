"use client";

import { marketProduct } from "@/functions/client/market";
import { useMemo, useState } from "react";
import styles from "./ProductCheckoutCard.module.css";
import { productT } from "@/functions/server/database";
import Image from "next/image";
import PricePart from "../pricePart/PricePart";
import trashIcon from "@/assets/bx-trash.svg";
import Skeleton from "../skeleton/Skeleton";

export type checkoutProduct = marketProduct & { data: productT };

export type productCheckoutProps = {
  product: checkoutProduct;
  removeFromMarketHigher: (productUID: string) => void;
};

export default function ProductCheckoutCard({
  product,
  removeFromMarketHigher,
}: productCheckoutProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // useRenderCount("productBig" + product.uid.toString());

  return (
    <div className={styles.productOrder}>
      <div className={styles.firstPart}>
        <div className={styles.imgDiv}>
          <Image
            src={product.data.img}
            title={"productImage"}
            alt={""}
            fill
            onLoad={() => setImageLoaded(true)}
          ></Image>
          {!imageLoaded && (
            <Skeleton
              height="100%"
              width="100%"
              marginTop="0"
              marginBottom="0"
            ></Skeleton>
          )}
        </div>
        <div className={styles.firstPartContent}>
          <h4 className={styles.title}>{product.data.name}</h4>

          <div>
            <div>
              <p>
                <span className={styles.contentSubTitle}>size</span>
                {product.size}
              </p>
            </div>
            <div className={styles.colorDiv}>
              <span className={styles.contentSubTitle}>color</span>
              <div
                className={styles.colorBox}
                style={{ backgroundColor: product.color }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.secondPartCheckout}>
        <button
          className={styles.trashButton}
          onClick={() => {
            removeFromMarketHigher(product.uid);
          }}
        >
          <Image src={trashIcon} alt="remove icon" priority={true}></Image>
        </button>
        <PricePart
          oldPrice={product.data.oldPrice}
          price={product.data.price}
        ></PricePart>
      </div>
    </div>
  );
}
