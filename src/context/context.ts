import { createContext, useContext } from "react";

export type GlobalContent = {
  fnftId: string;
  setCopy: (c: string) => void;
};

export const MyGlobalContext = createContext<GlobalContent>({
  fnftId: "", // set a default value
  setCopy: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
