import { createContext, useContext } from "react";

export type GlobalContent = {
  fnftId: string;
  setFnftId: (c: string) => void;
};

export const MyGlobalContext = createContext<GlobalContent>({
  fnftId: "", // set a default value
  setFnftId: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
