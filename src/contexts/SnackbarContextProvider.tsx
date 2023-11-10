"use client";

import Snackbar from "@/components/snackbar/Snackbar";
import { createContext, useCallback, useContext, useState } from "react";

// TODO: write a better snackbar

const SnackbarContext = createContext<informUserT>(() => {});

export const useSnackbar = () => useContext(SnackbarContext);

type informUserT = (
  type: "success" | "default" | "error",
  message: string
) => void;

export type snackbarSettingsT = {
  type: "success" | "default" | "error";
  message: string;
};

export default function SnackbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [snackbarSettings, setSnackbarSettings] =
    useState<null | snackbarSettingsT>(null);

  const informUser: informUserT = useCallback((type, message) => {
    setSnackbarSettings({
      type,
      message,
    });
  }, []);

  return (
    <SnackbarContext.Provider value={informUser}>
      <Snackbar settings={snackbarSettings}></Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
}
