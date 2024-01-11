import { ReactElement, createContext, useContext } from "react";

export const HeadContext = createContext<{head?: ReactElement}>({});

export const useHead = () => {
  return useContext(HeadContext);
};
