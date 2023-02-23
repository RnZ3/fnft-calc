import { chakra, Tr, Td, useColorModeValue } from "@chakra-ui/react";
import { PsData, ProPs, PsRowProps } from "types/interfaces";

export const checkPsOnsale = (props: ProPs) => {
  let ret: PsData | null = null;

  const ret2 = props?.salesDataG.map((s: any) => {
    if (s.fnftid === props.fnftId) {
      console.log("match:", s.fnftid, props.fnftId, s.price);
      ret = { fnftid: s.fnftid, price: s.price, psid: s.psid };
    }
  });
  //console.log(ret);
  return ret;
};

export function PsRow(props: PsRowProps): JSX.Element {
  const wracColor = useColorModeValue("green", "lime");
  const psData: PsData | null = checkPsOnsale({
    fnftId: props.fnftId,
    salesDataG: props.salesDataG,
  });

  const wrac = () => {
    let ret = "";
    if (psData) {
      ret = ((1 - psData["price"] / props.lqdrFTM) * 100).toFixed(0);
    }
    return ret;
  };

  return (
    <>
      {psData ? (
        <Tr>
          <Td p={"0px 0px 0px 0px"}>Price on PS:</Td>
          <Td style={{ padding: "0px 0px 0px 0px" }}>
            {psData["price"]} FTM{" "}
            <chakra.span color={parseInt(wrac()) >= 0 ? wracColor : "red"}>
              ({wrac()}%)
            </chakra.span>
          </Td>
        </Tr>
      ) : (
        <></>
      )}
    </>
  );
}
