"use client";

import {
  emptyMarket,
  marketProduct,
  removeFromMarket,
} from "@/functions/client/market";
import { productT, userPartial } from "@/functions/server/database";
import useClearClientCache from "@/hooks/useClearClientCache";
import styles from "./checkout.module.css";
import { useCallback, useMemo, useRef, useState } from "react";
import { useMarket } from "@/contexts/MarketContextProvider";
import { TextInput } from "@/components/textInput/TextInput";
import { useSnackbar } from "@/contexts/SnackbarContextProvider";
import PricePart from "@/components/pricePart/PricePart";
import { CustomButton, LinkButton } from "@/components/buttons/Buttons";
import useCSRF from "@/hooks/useCSRF";
import {
  buyMarketRequestBody,
  buyMarketResponse,
} from "@/app/api/buyMarket/route";
import { useRouter } from "next/navigation";
import ProductCheckout from "@/components/productCardBig/ProductCheckout";

export default function CheckOutClient({
  userData,
  initialMarket,
  necessaryProducts,
}: {
  userData: userPartial | undefined;
  initialMarket: marketProduct[];
  necessaryProducts: productT[];
}) {
  useClearClientCache("Checkout");

  const [checkoutMarket, setCheckoutMarket] = useState(initialMarket);

  const { setMarket } = useMarket();

  // * empty both localStorage market and checkoutMarket
  const emptyMarkets = useCallback(() => {
    setCheckoutMarket([]);
    emptyMarket(setMarket);
  }, []);

  return (
    <main className={styles.main}>
      <div
        className={[
          styles.checkout,
          checkoutMarket.length === 0 ? styles.emptyMarket : "",
        ].join(" ")}
      >
        {checkoutMarket.length > 0 ? (
          checkoutMarket.map((e) => (
            <ProductCheckout
              key={e.uid}
              product={{
                ...e,
                data: necessaryProducts.filter((ie) => ie.id === e.pid)[0],
              }}
              removeFromMarketHigher={(productUID: string) => {
                removeFromMarket(setMarket, productUID);
                setCheckoutMarket((pv) =>
                  pv.filter((e) => productUID !== e.uid)
                );
              }}
            ></ProductCheckout>
          ))
        ) : (
          <>
            <p>It seems like market is empty.</p>
            <LinkButton href="/products" title="go to products"></LinkButton>
          </>
        )}
      </div>
      {/*  Do not show bottom part if there is no item in the market. */}
      {checkoutMarket.length > 0 && (
        <CheckoutBottomPart
          initialComponentState={userData !== undefined ? "user" : "guest"}
          userData={userData}
          checkoutMarket={checkoutMarket}
          necessaryProducts={necessaryProducts}
          emptyMarkets={emptyMarkets}
        ></CheckoutBottomPart>
      )}
    </main>
  );
}

type checkoutBottomPartComponentStates =
  | "guest"
  | "user"
  | "address"
  | "payment";

function CheckoutBottomPart({
  initialComponentState,
  userData,
  checkoutMarket,
  necessaryProducts,
  emptyMarkets,
}: {
  initialComponentState: checkoutBottomPartComponentStates;
  userData: userPartial | undefined;
  checkoutMarket: marketProduct[];
  necessaryProducts: productT[];
  emptyMarkets: () => void;
}) {
  const [componentState, setComponentState] =
    useState<checkoutBottomPartComponentStates>(initialComponentState);

  const countryRef = useRef(userData ? userData.country : "");
  const cityRef = useRef(userData ? userData.city : "");
  const addressRef = useRef(userData ? userData.address : "");

  const [buyIsDisable, setBuyIsDisable] = useState(false);

  const informUser = useSnackbar();

  const addressValidation = useCallback(() => {
    if (
      countryRef.current.trim().length === 0 ||
      cityRef.current.trim().length === 0 ||
      addressRef.current.trim().length === 0
    ) {
      informUser("error", "Please write your address.");
      return false;
    }
    return true;
  }, []);

  const { oldPriceSum, priceSum } = useMemo(() => {
    let priceSum = 0;
    let oldPriceSum = 0;

    checkoutMarket.map((e) => {
      const currentProduct = necessaryProducts.filter(
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
  }, [checkoutMarket]);

  const hashedCSRFTokenHeader = useCSRF();

  const router = useRouter();

  const buyProducts = async () => {
    setBuyIsDisable(true);

    const fetchBuyResponse: buyMarketResponse = await (
      await fetch("/api/buyMarket", {
        method: "POST",
        headers: { ...hashedCSRFTokenHeader },
        body: JSON.stringify({
          market: checkoutMarket,
          country: countryRef.current,
          city: cityRef.current,
          address: addressRef.current,
        } as buyMarketRequestBody),
      })
    )
      .json()
      .catch((e) => informUser("error", e.message.trim(0, 50) + "..."));

    if (fetchBuyResponse.status) {
      setBuyIsDisable(false);

      informUser(
        "success",
        fetchBuyResponse.value.itemCount +
          (fetchBuyResponse.value.itemCount > 1 ? " items " : " item ") +
          "bought."
      );
      emptyMarkets();
      router.push("/");
    } else {
      informUser("error", fetchBuyResponse.message);
    }
  };

  return (
    <div className={styles.bottomPart}>
      <div className={styles.innerBottomPart}>
        <div
          className={[
            styles.slider,
            styles.addressDiv,
            componentState === "address"
              ? styles.showSlider
              : styles.unShowSlider,
          ].join(" ")}
        >
          <div>
            <TextInput
              label="country"
              name="country"
              required={true}
              type="text"
              className={styles.topInput}
              valueRef={countryRef}
            ></TextInput>
            <TextInput
              label="city"
              name="city"
              required={true}
              type="text"
              className={styles.topInput}
              valueRef={cityRef}
            ></TextInput>
          </div>
          <TextInput
            label="address"
            name="address"
            required={true}
            type="text"
            className={styles.bottomInput}
            valueRef={addressRef}
            marginTop="0.5rem"
          ></TextInput>
        </div>
        <div
          className={[
            styles.slider,
            styles.paymentDiv,
            componentState === "payment" ? styles.showSlider : "",
          ].join(" ")}
        >
          There is no payment method. Everything is free.
        </div>
        <div className={styles.content}>
          <div className={styles.leftPart}>
            <PricePart oldPrice={oldPriceSum} price={priceSum}></PricePart>
          </div>
          <div className={styles.rightPart}>
            {componentState === "guest" ? (
              <>
                <LinkButton href="/signIn" title="sign in"></LinkButton>
                <LinkButton href="/signUp" title="sign up"></LinkButton>
              </>
            ) : componentState === "user" ? (
              <>
                <CustomButton
                  title="next"
                  onClick={() => {
                    setComponentState("address");
                  }}
                ></CustomButton>
              </>
            ) : componentState === "address" ? (
              <>
                <CustomButton
                  title="back"
                  onClick={() => {
                    setComponentState("user");
                  }}
                ></CustomButton>
                <CustomButton
                  title="next"
                  onClick={() => {
                    if (addressValidation()) setComponentState("payment");
                  }}
                ></CustomButton>
              </>
            ) : componentState === "payment" ? (
              <>
                <CustomButton
                  title="back"
                  onClick={() => {
                    setComponentState("address");
                  }}
                ></CustomButton>
                <CustomButton
                  title="buy"
                  onClick={buyProducts}
                  disabled={buyIsDisable}
                ></CustomButton>
              </>
            ) : (
              <>You are not supposed to see this.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
