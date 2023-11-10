"use client";

import { productT, sizesT } from "@/functions/server/database";
import ProductCard from "@/components/productCard/ProductCard";
import styles from "./products.module.css";
import { memo, useMemo, useState } from "react";
import Filter from "@/components/filter/Filter";
import Search from "@/components/search/Search";

export type filterObjectT = {
  type: ("accessory" | "clothing")[] | null;
  sex: ("man" | "woman" | "unisex")[] | null;
  size: sizesT[] | null;
  priceOrder: "decreasing" | "increasing" | null;
};

const ProductCard_MEMO = memo(ProductCard);

export default function ProductsClient({ products }: { products: productT[] }) {
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filterObject, setFilterObject] = useState<filterObjectT>({
    type: null,
    sex: null,
    size: null,
    priceOrder: null,
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((e) =>
        filterObject.type === null ? true : filterObject.type.includes(e.type)
      )
      .filter((e) =>
        filterObject.sex === null ? true : filterObject.sex.includes(e.sex)
      )
      .filter((e) => {
        if (filterObject.size === null || !e.hasSizes) return true;

        for (let i = 0; i < filterObject.size.length; i++) {
          if (e.sizes.includes(filterObject.size[i])) return true;
        }

        return false;
      })
      .sort((firstItem, secondItem) => {
        switch (filterObject.priceOrder) {
          case null: {
            return 0;
          }
          case "increasing": {
            return firstItem.price - secondItem.price;
          }
          case "decreasing": {
            return secondItem.price - firstItem.price;
          }

          default:
            return 0;
        }
      })
      .filter((e) => e.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, filterObject]);

  return (
    <>
      <div className={styles.top}>
        <h4 className={styles.title}>ALL PRODUCTS</h4>
        <div className={styles.topRight}>
          <Search
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setShowFilter={setShowFilter}
            searchText={searchText}
            setSearchText={setSearchText}
          ></Search>

          <Filter
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            setShowSearch={setShowSearch}
            setFilterObject={setFilterObject}
          ></Filter>
        </div>
      </div>

      <div className={styles.content}>
        {filteredProducts.map((e) => (
          <ProductCard_MEMO key={e.id} productData={e}></ProductCard_MEMO>
        ))}
      </div>
    </>
  );
}
