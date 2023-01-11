export interface TokenPrice {
  id: string;
  current_price: number;
}

export interface TokenData {
  amount: number;
  token:  string;
}

export interface FinalArray {
  value:  number;
  token:  string;
  cgname: string;
  amount: number;
  price: number;
  image: string;
}
