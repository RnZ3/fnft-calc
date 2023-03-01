import { useState } from "react";
import { useGlobalContext } from "context/context";
import { Box, Text } from "@chakra-ui/react";
import type { SalesData } from "types/interfaces";
import { usePswMeta, usePsw } from "hooks/useMyQueries";
import { PsTable } from "components/PsTable";

//export const psItemUrl = "https://paintswap.finance/marketplace/fantom/financial/";

export function PaintSwap() {
  const { salesDataG } = useGlobalContext();
  const { fnftId, setFnftId } = useGlobalContext();
  const [psEnabled, setPsEnabled] = useState(false);
  const { data: pswData, isSuccess: pswLoaded } = usePsw(psEnabled);

  const pswMetaData = usePswMeta(pswLoaded, pswData);

  //console.log(pswMetaData.length)
  salesDataG.length = 0;
  if (pswMetaData && pswMetaData.length !== 0) {
    pswMetaData?.forEach((meta: any, _index1: number): void => {
      if (meta?.data?.properties.asset_name === "xLQDR") {
        pswData?.sales?.forEach((ons: any, _index2: number) => {
          //          console.log("map2", _index1, _index2);
          if (meta.data.properties.id === ons.tokenId) {
            //              console.log( meta.data.properties.asset_name, meta.data.properties.id, ons.id);
            const data: SalesData = {
              psid: ons.id,
              fnftid: ons.tokenId,
              price: ons.price / 1000000000000000000,
              endtime: ons.endTime,
              isauction: ons.isAuction,
              asset: meta.data.properties.asset_name,
              image: meta.data.image,
            };
            salesDataG.push(data);
            console.log("push", data.fnftid);
          }
        });
      }
    });
  }

  function handlePs(e: string): void {
    scrollToTop();
    console.log(e, fnftId);
    setFnftId(e);
    scrollToTop();
  }
  let finalData: SalesData[] = [];

  if (psEnabled && (!pswLoaded || !pswMetaData) && salesDataG.length !== 0) {
    return (
      <Box>
        <Text>Loading ... </Text>
      </Box>
    );
  } else if (psEnabled && pswMetaData && salesDataG) {
    //console.log(salesDataG)
    salesDataG.sort((a, b) => parseFloat(a.fnftid) - parseFloat(b.fnftid));
    finalData = salesDataG.reduce((result: SalesData[], offer) => {
      if (offer.asset === "xLQDR") {
        result.push(offer);
      }
      return result;
    }, []);
    console.log(finalData);
  }
  return (
    <>
      {psEnabled ? (
        <PsTable finalData={finalData} handlePs={handlePs} />
      ) : (
        <></>
      )}
      <Box m={6}>
        <button onClick={() => setPsEnabled(!psEnabled)}>
          {psEnabled ? "hide" : "show"} PaintSwap offers
        </button>
      </Box>
    </>
  );
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    //    behavior: "smooth",
  });
};
