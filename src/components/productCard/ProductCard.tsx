"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./productCard.module.css";
import React, { Fragment, useCallback, useState } from "react";
import bagIcon from "@/assets/bag-shopping-solid.svg";
import { productT, sizesT } from "@/functions/server/database";
import PricePart from "../pricePart/PricePart";
import returnIcon from "@/assets/bx-chevron-left.svg";
import { addToMarket } from "@/functions/client/market";
import { useMarket } from "@/contexts/MarketContextProvider";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import Skeleton from "../skeleton/Skeleton";

export default function ProductCard({
  productData,
}: {
  productData: productT;
}) {
  const [showFront, setShowFront] = useState(true);

  // useRenderCount("productCard" + productData.id);

  return (
    <>
      <div className={styles.card}>
        <div
          className={styles.front}
          style={
            showFront
              ? { transform: `rotateY(0deg)` }
              : { transform: `rotateY(180deg)` }
          }
        >
          <Link href={"/products/" + productData.id} className={styles.imgDiv}>
            <ProductImage imgName={productData.img}></ProductImage>
          </Link>
          <div className={styles.frontBottom}>
            <h3 className={styles.title}>
              <Link href={"/products/" + productData.id}>
                {productData.name}
              </Link>
            </h3>
            <div className={styles.priceMarketPart}>
              <PricePart
                price={productData.price}
                oldPrice={productData.oldPrice}
              ></PricePart>

              <button
                className={styles.addMarketButton}
                onClick={() => {
                  setShowFront(false);
                }}
              >
                <Image
                  src={bagIcon}
                  priority={true}
                  className={styles.addMarketButtonSvg}
                  title="add to market"
                  alt="add to market"
                ></Image>
              </button>
            </div>
          </div>
        </div>

        <div
          className={styles.back}
          style={
            showFront
              ? { transform: `rotateY(-180deg)` }
              : { transform: `rotateY(0deg)` }
          }
        >
          <ProductBack
            setShowFront={setShowFront}
            productData={productData}
          ></ProductBack>
        </div>
      </div>
    </>
  );
}

function ProductImage({ imgName }: { imgName: string }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <Image
        src={imgName.split(".")[0] + "-cropped." + imgName.split(".")[1]}
        sizes="(max-width: 500px) 30vw,
  (max-width: 1200px) 20vw,
  20vw"
        fill
        alt=""
        onLoad={() => setImageLoaded(true)}
      ></Image>

      {imageLoaded === false && (
        <Skeleton
          width="100%"
          height="100%"
          marginTop="0"
          marginBottom="0"
        ></Skeleton>
      )}
    </>
  );
}

function ProductBack({
  productData,
  setShowFront,
}: {
  productData: productT;
  setShowFront: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [size, setSize] = useState<sizesT | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [showFillError, setShowFillError] = useState<boolean[]>([false, false]);

  const resetBack = useCallback(() => {
    setColor(null);
    setSize(null);
    setShowFillError([false, false]);
  }, []);

  const validateForm = useCallback(
    (
      size: sizesT | null,
      color: string | null,
      setShowFillError: React.Dispatch<React.SetStateAction<boolean[]>>
    ) => {
      setShowFillError([false, false]);
      if (productData.hasSizes)
        if (color === null || size === null) {
          setShowFillError([size === null, color === null]);
          return false;
        } else return true;
      else {
        if (color === null) {
          setShowFillError([false, color === null]);
          return false;
        } else return true;
      }
    },
    []
  );

  const { setMarket } = useMarket();
  const informUser = useSnackbar();

  return (
    <>
      <div className={styles.backTop}>
        <button
          onClick={() => {
            resetBack();
            setShowFront(true);
          }}
          className={styles.returnButton}
        >
          <Image
            src={returnIcon}
            className={styles.addMarketButtonSvg}
            title="return"
            alt="return"
          ></Image>
        </button>
        <h3 className={styles.title}>
          <Link href={"/products/" + productData.id}>{productData.name}</Link>
        </h3>
        <p>{productData.sex}</p>
      </div>

      <div className={styles.middlePart}>
        {productData.hasSizes && (
          <div className={styles.sizesPart}>
            <h3 className={styles.title}>SIZES</h3>
            <div className={styles.sizeChoices}>
              {(["XS", "S", "M", "L", "XL", "XXL"] as sizesT[]).map((e) =>
                productData.sizes?.includes(e) ? (
                  <Fragment key={e}>
                    <input
                      type="radio"
                      name="size"
                      id={productData.id.toString() + e}
                      className={styles.sizeInput}
                      onClick={() => {
                        setSize(e);
                      }}
                    />
                    <label
                      htmlFor={productData.id.toString() + e}
                      className={[
                        styles.sizeInputLabel,
                        styles.sizeInputLabelSelectable,
                        e === size ? styles.sizeInputLabelSelected : "",
                      ].join(" ")}
                    >
                      {e}
                    </label>
                  </Fragment>
                ) : (
                  <Fragment key={e}>
                    <input
                      type="radio"
                      name="size"
                      id={productData.id.toString() + e}
                      className={styles.sizeInput}
                      disabled
                    />
                    <label
                      htmlFor={productData.id.toString() + e}
                      className={[styles.sizeInputLabel].join(" ")}
                    >
                      {e}
                    </label>
                  </Fragment>
                )
              )}
            </div>
            {showFillError[0] && (
              <p className={styles.errorFill}>*Please choose a size.</p>
            )}
          </div>
        )}

        <div className={styles.colorsPart}>
          <h3 className={styles.title}>COLORS</h3>
          <div className={styles.colorChoices}>
            {productData.colors.map((e) => (
              <Fragment key={e}>
                <input
                  type="radio"
                  name="color"
                  id={productData.id.toString() + e}
                  className={styles.colorInput}
                  onClick={() => {
                    setColor(e);
                  }}
                />
                <label
                  htmlFor={productData.id.toString() + e}
                  className={[
                    styles.colorInputLabel,
                    e === color ? styles.colorInputLabelSelected : "",
                  ].join(" ")}
                  style={{ backgroundColor: e }}
                  title={e}
                ></label>
              </Fragment>
            ))}
          </div>
          {showFillError[1] && (
            <p className={styles.errorFill}>*Please choose a color.</p>
          )}
        </div>
      </div>

      <div className={styles.backBottom}>
        <PricePart
          price={productData.price}
          oldPrice={productData.oldPrice}
        ></PricePart>

        <button
          className={styles.addMarketButton}
          onClick={() => {
            if (validateForm(size, color, setShowFillError)) {
              addToMarket(setMarket, {
                uid: Math.random().toString(),
                pid: productData.id,
                color: color as string,
                size: size as sizesT,
              });
              informUser(
                "success",
                productData.name + " successfully added to market."
              );
              resetBack();
              setShowFront(true);
            }
          }}
        >
          <Image
            src={bagIcon}
            className={styles.addMarketButtonSvg}
            title="add to market"
            alt="add to market"
          ></Image>
        </button>
      </div>
    </>
  );
}
