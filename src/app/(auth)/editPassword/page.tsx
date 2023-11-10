import { Metadata } from "next";
import EditPasswordClient from "./client";

export const metadata: Metadata = {
  title: "MODA - EDIT PASSWORD",
};

export default function EditPassword() {
  // * Pre-rendered on build

  return <EditPasswordClient></EditPasswordClient>;
}
