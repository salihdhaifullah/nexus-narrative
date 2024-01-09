import { createContext, useContext } from "react";

export const HeadContext = createContext<{head?: () => JSX.Element}>({});

export const useHead = () => {
  return useContext(HeadContext);
};
