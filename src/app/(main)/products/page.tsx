"use server-only";

import { fetchAllProducts } from "@/functions/server/database";
import styles from "./products.module.css";
import ProductsClient from "./client";
import Footer from "@/components/footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MODA - PRODUCTS",
};

export default async function Products() {
  // * Pre-renders on build
  // * Show user all products to user
  // * With filtration and option add products to market

  const products = await fetchAllProducts();

  return (
    <>
      <main className={styles.main}>
        {products.status ? (
          <ProductsClient products={products.value}></ProductsClient>
        ) : (
          <>{products.message}</>
        )}
      </main>
      <Footer></Footer>
    </>
  );
}
