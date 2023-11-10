"use client";

import { filterObjectT } from "@/app/(main)/products/client";
import { productT, sizesT } from "@/functions/server/database";
import React, { useCallback, useState } from "react";
import filterIcon from "@/assets/bx-filter.svg";
import Image from "next/image";
import styles from "./filter.module.css";
import closeIcon from "@/assets/bx-x.svg";

const fullFilterChoices: {
  type: ("accessory" | "clothing")[];
  sex: ("man" | "woman" | "unisex")[];
  size: sizesT[];
  priceOrder: ("decreasing" | "increasing")[];
} = {
  type: ["accessory", "clothing"],
  sex: ["man", "woman", "unisex"],
  size: ["XS", "S", "M", "L", "XL", "XXL"],
  priceOrder: ["increasing", "decreasing"],
};

export default function Filter({
  showFilter: showMain,
  setShowFilter: setShowMain,
  setShowSearch,
  setFilterObject,
}: {
  showFilter: boolean;
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterObject: React.Dispatch<React.SetStateAction<filterObjectT>>;
}) {
  const [filterObjectForm, setFilterObjectForm] = useState<filterObjectT>({
    type: null,
    sex: null,
    size: null,
    priceOrder: null,
  });

  const returnNewChoiceArray = useCallback(
    // * returns new array by looking current value
    (previousArray: string[] | null, currentItem: string, value: boolean) => {
      if (previousArray === null) {
        return value ? [currentItem] : null;
      }

      if (value) {
        if (previousArray.includes(currentItem)) return previousArray;
        return [...previousArray, currentItem];
      } else {
        if (!previousArray.includes(currentItem)) return previousArray;

        const newArray = [
          ...previousArray.slice(0, previousArray.indexOf(currentItem)),
          ...previousArray.slice(
            previousArray.indexOf(currentItem) + 1,
            previousArray.length
          ),
        ];
        return newArray.length === 0 ? null : newArray;
      }
    },
    []
  );

  return (
    <div
      className={[styles.container, showMain ? styles.widthMargin : ""].join(
        " "
      )}
    >
      <button
        className={styles.button}
        onClick={() => {
          setShowMain(true);
          setShowSearch(false);
        }}
      >
        <Image
          src={filterIcon}
          alt=""
          className={styles.icon}
          priority={true}
        ></Image>
      </button>

      <div
        className={[styles.main, showMain ? styles.showMain : ""].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.row}>
          <div className={styles.rowTop}>
            type
            <button className={styles.closeButton}>
              <Image
                src={closeIcon}
                alt=""
                onClick={() => setShowMain(false)}
              ></Image>
            </button>
          </div>
          <div className={styles.choices}>
            {fullFilterChoices.type.map((e) => (
              <CustomCheckBox
                key={e}
                selected={
                  filterObjectForm.type === null
                    ? false
                    : filterObjectForm.type.includes(e)
                }
                setSelected={(value: boolean) => {
                  setFilterObjectForm((pv) => {
                    return {
                      ...pv,
                      type: returnNewChoiceArray(
                        pv.type,
                        e,
                        value
                      ) as filterObjectT["type"],
                    };
                  });
                }}
                title={e}
              ></CustomCheckBox>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <p className={styles.rowTop}>sex</p>
          <div className={styles.choices}>
            {fullFilterChoices.sex.map((e) => (
              <CustomCheckBox
                key={e}
                selected={
                  filterObjectForm.sex === null
                    ? false
                    : filterObjectForm.sex.includes(e)
                }
                setSelected={(value: boolean) => {
                  setFilterObjectForm((pv) => {
                    return {
                      ...pv,
                      sex: returnNewChoiceArray(
                        pv.sex,
                        e,
                        value
                      ) as filterObjectT["sex"],
                    };
                  });
                }}
                title={e}
              ></CustomCheckBox>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <p className={styles.rowTop}>size</p>
          <div className={styles.choices}>
            {fullFilterChoices.size.map((e) => (
              <CustomCheckBox
                key={e}
                selected={
                  filterObjectForm.size === null
                    ? false
                    : filterObjectForm.size.includes(e)
                }
                setSelected={(value: boolean) => {
                  setFilterObjectForm((pv) => {
                    return {
                      ...pv,
                      size: returnNewChoiceArray(
                        pv.size,
                        e,
                        value
                      ) as filterObjectT["size"],
                    };
                  });
                }}
                title={e}
              ></CustomCheckBox>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <p className={styles.rowTop}>price</p>
          <div className={styles.choices}>
            {fullFilterChoices.priceOrder.map((e) => (
              <CustomCheckBox
                key={e}
                selected={
                  filterObjectForm.priceOrder === null
                    ? false
                    : filterObjectForm.priceOrder.includes(e)
                }
                setSelected={(value: boolean) => {
                  setFilterObjectForm((pv) => {
                    return {
                      ...pv,
                      priceOrder: value ? e : null,
                    };
                  });
                }}
                title={e}
              ></CustomCheckBox>
            ))}
          </div>
        </div>
        <div className={styles.bottom}>
          {(filterObjectForm.type !== null ||
            filterObjectForm.sex !== null ||
            filterObjectForm.size !== null ||
            filterObjectForm.priceOrder !== null) && (
            <button
              onClick={() => {
                setFilterObjectForm({
                  type: null,
                  sex: null,
                  size: null,
                  priceOrder: null,
                });
                setFilterObject({
                  type: null,
                  sex: null,
                  size: null,
                  priceOrder: null,
                });
              }}
            >
              CLEAR
            </button>
          )}
          <button
            onClick={() => {
              setFilterObject(filterObjectForm);
            }}
          >
            APPLY
          </button>
        </div>
      </div>

      {showMain && (
        <div
          onClick={() => {
            setShowMain(false);
          }}
          className={styles.fullScreen}
        ></div>
      )}
    </div>
  );
}

function CustomCheckBox({
  selected,
  setSelected,
  title,
}: {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  title: string;
}) {
  return (
    <label
      className={[styles.label, selected ? styles.selected : ""].join(" ")}
    >
      {title}
      <input
        onChange={(e) => setSelected(e.target.checked)}
        type="checkbox"
        className={styles.checkbox}
        checked={selected}
      ></input>
    </label>
  );
}
