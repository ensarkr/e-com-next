import { snackbarSettingsT } from "@/contexts/SnackbarContextProvider";
import { useEffect, useRef, useState } from "react";
import styles from "./snackbar.module.css";

export default function Snackbar({
  settings,
}: {
  settings: snackbarSettingsT | null;
}) {
  // * When settings change it puts new snackbar message to array
  // * Then removes them after 6 seconds

  const [snackbarArray, setSnackbarArray] = useState<
    (snackbarSettingsT & { show: boolean; id: number })[]
  >([]);

  useEffect(() => {
    if (settings) {
      const id = Math.random();
      setSnackbarArray((pv) => [...pv, { ...settings, id, show: true }]);
      setTimeout(() => {
        setSnackbarArray((pv) => pv.filter((e) => e.id !== id));
      }, 6000);
    }
  }, [settings]);

  return (
    <>
      {snackbarArray.map((e, i) => (
        <div
          key={e.id}
          className={[styles.snackbar].join(" ")}
          style={{ bottom: 40 + i * 42 }}
        >
          {e.message}
        </div>
      ))}
    </>
  );
}
