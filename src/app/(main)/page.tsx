"use server-only";

import { fetchPopularProducts } from "@/functions/server/database";
import styles from "./page.module.css";
import ProductCard from "@/components/productCard/ProductCard";
import { cache, memo } from "react";
import ProductCardButton from "@/components/productCard/ProductCardButton";
import PicSlide from "@/components/picSlide/PicSlide";
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

const ProductCard_MEMO = memo(ProductCard);

export const metadata: Metadata = {
  title: "MODA - HOME",
};

export default async function Home() {
  // * Pre-renders on build
  // * It shows popular products

  const products = await fetchPopularProducts();

  return (
    <>
      <main className={styles.main}>
        <PicSlide></PicSlide>
        <h3 style={{ marginTop: 0 }}>POPULAR PRODUCTS</h3>
        <div className={styles.popularProducts}>
          {products.status ? (
            <>
              {products.value.map((e) => (
                <ProductCard_MEMO key={e.id} productData={e}></ProductCard_MEMO>
              ))}
              <ProductCardButton></ProductCardButton>
            </>
          ) : (
            <>{products.message}</>
          )}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
