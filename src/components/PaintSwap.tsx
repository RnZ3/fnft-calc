import { useState } from "react";
import { ExtLink } from "components/ExtLink";
import { useGlobalContext } from "context/context";
import {
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Box,
  Text,
  Center,
  Hide,
} from "@chakra-ui/react";
import { usePswMeta, usePsw } from "hooks/useMyQueries";

const psItemUrl = "https://paintswap.finance/marketplace/fantom/financial/";

export function PaintSwap() {
  var salesData: any[] = [];
  const { fnftId, setFnftId } = useGlobalContext();
  const [checkPs, setCheckPs] = useState(false);

  const { data: pswData, isSuccess: pswLoaded } = usePsw(checkPs);

  const pswMetaData = usePswMeta(pswData);

  pswMetaData?.forEach((meta: any) => {
    if (meta?.data?.properties.asset_name === "xLQDR") {
      pswData?.sales?.forEach((ons: any) => {
        if (meta.data.properties.id === ons.tokenId) {
          //            console.log( meta.data.properties.asset_name, meta.data.properties.id, ons.id);
          const data: any = {
            psid: ons.id,
            fnftid: ons.tokenId,
            price: ons.price / 1000000000000000000,
            endtime: ons.endTime,
            isauction: ons.isAuction,
            asset: meta.data.properties.asset_name,
            image: meta.data.image,
          };
          salesData.push(data);
          //            console.log(data);
        }
      });
    }
  });
  //    console.log(salesData);

  function handlePs(e: string) {
    console.log(e, fnftId);
    setFnftId(e);
  }

  salesData.sort((a, b) => parseFloat(a.fnftid) - parseFloat(b.fnftid));

  if (checkPs && (!pswLoaded || !pswMetaData)) {
    return (
      <Box>
        <Text>Loading ... </Text>
      </Box>
    );
  } else if (checkPs && pswMetaData) {
    var finalData = salesData.reduce(function (result, offer) {
      if (offer.asset === "xLQDR") {
        result.push(offer);
      }
      return result;
    }, []);

    console.log(finalData);

    return (
      <>
        <Box style={{ marginTop: "12px" }}>
          <Text mb={4}>
            currently <Text as="b"> {finalData.length} </Text> xLQDR fNFT
            offered on PaintSwap:
          </Text>
          <Center>
            <Box className={finalData.length > 0 ? "" : "hidden"}>
              <Table>
                <Thead>
                  <Tr className="tb">
                    <Th align="center" colSpan={2}>
                      fNFT ID
                    </Th>
                    <Th align="right">Price</Th>
                    <Hide below="md">
                      <Th>Type</Th>
                      <Th>End time</Th>
                    </Hide>
                    <Th align="right">visit on PS</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {finalData.map((ps: any, i: number) => (
                    <Tr key={i}>
                      <Td>
                        <Box boxSize="6">
                          <Image src={ps.image} />
                        </Box>
                      </Td>
                      <Td align="center">
                        <button onClick={() => handlePs(ps.fnftid)}>
                          {ps.fnftid}
                        </button>
                      </Td>
                      <Td align="right">{ps.price} FTM</Td>
                      <Hide below="md">
                        <Td align="center">
                          {ps.isauction ? "auction" : "sale"}
                        </Td>
                        <Td>{new Date(ps.endtime * 1000).toUTCString()}</Td>
                      </Hide>
                      <Td align="right">
                        <Link
                          href={psItemUrl + ps.psid}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {ps.psid} <ExtLink />
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Center>
        </Box>
        <Box style={{ margin: "2rem" }}>
          <button onClick={() => setCheckPs(false)}>
            hide PaintSwap offers
          </button>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box style={{ margin: "2rem" }}>
          <button onClick={() => setCheckPs(true)}>
            show PaintSwap offers
          </button>
        </Box>
      </>
    );
  }
}
