export interface FnftId {
  fnftId: string;
}

export interface ProPs extends FnftId {
  salesDataG: SalesData[];
}

export interface PsRowProps extends ProPs {
  lqdrFTM: number;
}

export interface PsData {
  fnftid: string;
  price: number;
  psid: string;
}

export interface FinalArray {
  value: number;
  token: string;
  cgname: string;
  amount: number;
  price: number;
  image: string;
}

export interface SalesData {
  psid: string;
  fnftid: string;
  price: number;
  endtime: string;
  isauction: boolean;
  asset: string;
  image: string;
}

export interface TokenPrice {
  id: string;
  current_price: number;
}

export interface TokenData {
  amount: number;
  token: string;
}

export interface NF {
  finalData: SalesData[];
  handlePs: (e: string) => void;
}

