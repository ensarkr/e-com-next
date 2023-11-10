"use server-only";

import Footer from "@/components/footer/Footer";
import ProductCard from "@/components/productCard/ProductCard";
import { fetchAllProducts, fetchProduct } from "@/functions/server/database";
import styles from "./productId.module.css";
import { Metadata } from "next";

export async function generateStaticParams() {
  const allProducts = await fetchAllProducts();

  if (allProducts.status)
    return allProducts.value.map((product) => ({
      productId: product.id.toString(),
    }));
  else return [];
}

export const metadata: Metadata = {
  title: "MODA - PRODUCT",
};

export default async function Product({
  params,
}: {
  params: { productId: string };
}) {
  const product = await fetchProduct(parseInt(params.productId));

  return (
    <main className={styles.main}>
      <h2>Product pages have not implemented yet. Please check later.</h2>
      <pre>{product.status && JSON.stringify(product.value, null, 4)}</pre>
      {/* {product.status && (
        <ProductCard productData={product.value}></ProductCard>
      )} */}
    </main>
  );
}
