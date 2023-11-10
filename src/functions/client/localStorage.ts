const testLocalStorage = () => {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem("text", "test");
    window.localStorage.getItem("text");
  } catch {
    return false;
  }
  return true;
};

export { testLocalStorage };
