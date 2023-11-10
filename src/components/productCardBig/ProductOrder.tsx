import { marketProduct } from "@/functions/client/market";
import styles from "./productCardBig.module.css";
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

export default function ProductOrder({ product }: productOrderProps) {
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

          <div>
            <div>
              <p>
                <span className={styles.contentSubTitle}>size</span>
                {product.size}
              </p>
            </div>
            <div className={styles.colorDiv}>
              <span className={styles.contentSubTitle}>color</span>
              <div
                className={styles.colorBox}
                style={{ backgroundColor: product.color }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.secondPartOrder}>
        <p>
          <span className={styles.contentSubTitleSecondPart}>date</span>
          {product.boughtDate}
        </p>
        <p>
          <span className={styles.contentSubTitleSecondPart}>country</span>
          {product.country}
        </p>
        <p>
          <span className={styles.contentSubTitleSecondPart}>price</span>
          {product.boughtPrice} ₺
        </p>
        <p>
          <span className={styles.contentSubTitleSecondPart}>status</span>
          {product.orderStatus}
        </p>
      </div>
    </div>
  );
}
