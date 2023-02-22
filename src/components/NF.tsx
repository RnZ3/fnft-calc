import { SalesData } from "types/interfaces";

export interface NF {
  finalData: SalesData[];
  handlePs: (e: string) => void;
  setCheckPs: (e: boolean) => void;
}
