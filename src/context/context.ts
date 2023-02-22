import { createContext, useContext } from "react";

interface SalesData {
  psid: string;
  fnftid: string;
  price: number;
  endtime: string;
  isauction: boolean;
  asset: string;
  image: string;
}


export type GlobalContent = {
  fnftId: string;
  setFnftId: (c: string) => void;
  idHistory: string;
  setIdHistory: (c: string) => void;
  fromPs: boolean;
  setFromPs: (c: boolean) => void;
salesDataG: SalesData[];
setSalesDataG: (c: SalesData[]) => void;
};

export const MyGlobalContext = createContext<GlobalContent>({
  fnftId: "", // set a default value
  setFnftId: () => {},
  idHistory: "",
  setIdHistory: () => {},
  fromPs: false,
  setFromPs: () => {},
salesDataG: [],
setSalesDataG: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
