import styles from "./skeleton.module.css";

export default function Skeleton({
  width,
  height,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: {
  width?: string;
  height?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}) {
  return (
    <div
      title="skeleton"
      className={styles.skeleton}
      style={{
        width,
        height,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      }}
    ></div>
  );
}
