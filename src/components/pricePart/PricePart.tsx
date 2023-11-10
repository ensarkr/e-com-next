import styles from "./pricePart.module.css";

export default function PricePart({
  oldPrice,
  price,
}: {
  oldPrice: number | null;
  price: number;
}) {
  return (
    <div
      className={styles.main}
      style={oldPrice == 0 ? { visibility: "hidden" } : {}}
    >
      <div className={styles.double}>
        {oldPrice !== null && oldPrice != price && (
          <>
            <p>-{Math.trunc(((oldPrice - price) * 100) / oldPrice)}%</p>
            <p> {oldPrice}₺</p>
          </>
        )}
      </div>
      <div className={styles.single}>
        <p>{price}₺</p>
      </div>
    </div>
  );
}
