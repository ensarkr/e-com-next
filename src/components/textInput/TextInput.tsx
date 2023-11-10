"use client";

import { useState } from "react";
import styles from "./textInput.module.css";

export function TextInput({
  name,
  label,
  type,
  className,
  required,
  valueRef,
  defaultValue,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: {
  name: string;
  label: string;
  type: HTMLInputElement["type"];
  className?: string;
  required: boolean;
  valueRef?: React.MutableRefObject<string>;
  defaultValue?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}) {
  const [labelPosition, setLabelPosition] = useState<"up" | "down">(
    defaultValue === undefined && valueRef === undefined ? "down" : "up"
  );

  return (
    <div
      className={[styles.wrapper, className || ""].join(" ")}
      style={{
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
      }}
    >
      <label
        htmlFor={name}
        className={[styles.inputLabel, styles[labelPosition + "Position"]].join(
          " "
        )}
      >
        {label}
      </label>
      <input
        id={name}
        className={styles.textInput}
        type={type}
        name={name}
        required={required}
        onFocus={() => setLabelPosition("up")}
        onBlur={(event) => {
          if (event.target.value.length === 0) {
            setLabelPosition("down");
          }
        }}
        onChange={(event) => {
          if (valueRef !== undefined) valueRef.current = event.target.value;
        }}
        defaultValue={
          defaultValue ? defaultValue : valueRef ? valueRef.current : undefined
        }
      ></input>
    </div>
  );
}
