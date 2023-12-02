"use server-only";

import {
  fetchAllBoughtProducts,
  fetchAllProducts,
  fetchUserData,
} from "@/functions/server/database";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { LinkButton } from "@/components/buttons/Buttons";
import styles from "./orders.module.css";
import { Metadata } from "next";
import ProductOrderCard, { orderProduct } from "@/components/productOrderCard/productOrderCard";

export const metadata: Metadata = {
  title: "MODA - ORDERS",
};

export default async function Orders() {
  // * Only route that fully RSC except one link button
  // * It pre-rendered on request
  // * It fetches users bought items from DB
  // * And shows it to user

  const allProducts = await fetchAllProducts();

  // useClearClientCache("Orders");

  const session = await getServerSession(authOptions);

  let ordersWithoutProductData: undefined | Omit<orderProduct, "data">[] =
    undefined;

  if (
    session !== null &&
    session.user?.email !== undefined &&
    session.user?.email !== null
  ) {
    const getUserDataResponse = await fetchUserData(session.user.email);

    if (getUserDataResponse.status) {
      const fetchAllBoughtProductsResponse = await fetchAllBoughtProducts(
        session.user.email
      );

      if (fetchAllBoughtProductsResponse.status) {
        ordersWithoutProductData =
          fetchAllBoughtProductsResponse.value.allBoughtProducts;
      }
    }
  }

  return (
    <main className={styles.main}>
      <div
        className={[
          styles.orders,
          ordersWithoutProductData === undefined ||
          ordersWithoutProductData.length === 0
            ? styles.emptyOrders
            : "",
        ].join(" ")}
      >
        {ordersWithoutProductData !== undefined &&
        ordersWithoutProductData.length > 0 &&
        allProducts.status ? (
          ordersWithoutProductData.map((e, i) => (
            <ProductOrderCard
              key={i}
              product={{
                ...e,
                data: allProducts.value.filter((ie) => ie.id === e.pid)[0],
              }}
            ></ProductOrderCard>
          ))
        ) : (
          <>
            <p>It seems like you have not ordered anything.</p>
            <LinkButton href="/products" title="go to products"></LinkButton>
          </>
        )}
      </div>
    </main>
  );
}
