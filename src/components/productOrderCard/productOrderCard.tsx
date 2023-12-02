import { marketProduct } from "@/functions/client/market";
import styles from "./productOrderCard.module.css";
import { productT } from "@/functions/server/database";
import Image from "next/image";

export type orderProduct = Omit<marketProduct, "uid"> & {
  country: string;
  boughtPrice: number;
  orderStatus: string;
  color: string;
  size: string;
  boughtDate: string;
  data: productT;
};

export type productOrderProps = {
  product: orderProduct;
};

export default function ProductOrderCard({ product }: productOrderProps) {
  return (
    <div className={styles.productOrder}>
      <div className={styles.firstPart}>
        <div className={styles.imgDiv}>
          <Image
            src={product.data.img}
            title={"productImage"}
            alt={""}
            fill
          ></Image>
        </div>
        <div className={styles.firstPartContent}>
          <h4 className={styles.title}>{product.data.name}</h4>

          <div className={styles.contentElement}>
              <span className={styles.contentSubTitle}>size</span>
              {product.size}
          </div>
          <div className={styles.contentElement}>
            <span className={styles.contentSubTitle}>color</span>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: product.color }}
            ></div>
          </div>
          <div className={styles.contentElement}>
            <span className={styles.contentSubTitleSecondPart}>date</span>
            {product.boughtDate}
          </div>
          <div className={styles.contentElement}>
            <span className={styles.contentSubTitleSecondPart}>country</span>
            {product.country}
          </div>
          <div className={styles.contentElement}>
            <span className={styles.contentSubTitleSecondPart}>price</span>
            {product.boughtPrice} ₺
          </div>
          <div className={styles.contentElement}>
            <span className={styles.contentSubTitleSecondPart}>status</span>
            {product.orderStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
