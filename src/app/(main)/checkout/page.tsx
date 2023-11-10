import { cookies } from "next/headers";
import CheckOutClient from "./client";
import { marketProduct } from "@/functions/client/market";
import {
  fetchAllProducts,
  fetchUserData,
  productT,
  userPartial,
} from "@/functions/server/database";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MODA - CHECKOUT",
};

export default async function Checkout() {
  // * Pre-renders on request
  // * Gets market from cookies
  // * Then fetches their product datas and sends them to client component
  // * Also if user is authenticated it also send user data
  // * Client uses user address while buying items

  const initialMarket = cookies().get("market");

  const allProducts = await fetchAllProducts();
  let necessaryProducts: productT[] = [];

  if (allProducts.status && initialMarket !== undefined) {
    const parsedMarket = JSON.parse(initialMarket.value) as marketProduct[];
    necessaryProducts = allProducts.value.filter((allProductsElement) => {
      return (
        parsedMarket.filter(
          (marketElement) => marketElement.pid === allProductsElement.id
        ).length > 0
      );
    });
  }

  let userData: undefined | userPartial = undefined;

  const session = await getServerSession(authOptions);

  if (
    session !== null &&
    session.user?.email !== undefined &&
    session.user?.email !== null
  ) {
    const getUserDataResponse = await fetchUserData(session.user.email);

    if (getUserDataResponse.status) userData = getUserDataResponse.value;
  }

  return (
    <CheckOutClient
      userData={userData}
      initialMarket={
        initialMarket
          ? (JSON.parse(initialMarket.value) as marketProduct[])
          : []
      }
      necessaryProducts={necessaryProducts}
    ></CheckOutClient>
  );
}
