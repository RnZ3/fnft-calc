import { SalesData } from "types/SalesData";

//                <PsRow id={fnftId} sdata={salesDataG} lqdrFTM={lqdrFTM} />
export interface PsRowProps {
  fnftId: string;
  salesDataG: SalesData[];
  lqdrFTM: number;
}
