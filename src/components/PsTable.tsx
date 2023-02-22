import { ExtLink } from "components/ExtLink";
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
  Hide
} from "@chakra-ui/react";
import type { NF } from "types/interfaces";

const psItemUrl = "https://paintswap.finance/marketplace/fantom/financial/";

export function PsTable(props: NF): JSX.Element {
  return (
    <>
      <Box mt={4} sx={{   borderBottom: "1px dotted orange" }}>
        <Text mb={4} textAlign="center">
          currently <Text as="b"> {props.finalData.length} </Text> xLQDR fNFT
          offered on PaintSwap:
        </Text>
        <Center>
          <Box className={props.finalData.length > 0 ? "" : "hidden"}>
            <Table>
              <Thead>
                <Tr className="tb">
                  <Th align="center" colSpan={2}>
                    fNFT ID
                  </Th>
                  <Th align="right">Price</Th>
                  <Hide below="sm">
                    <Th>Type</Th>
                  </Hide>
                  <Hide below="md">
                    <Th>End time</Th>
                  </Hide>
                  <Th align="right">visit on PS</Th>
                </Tr>
              </Thead>
              <Tbody>
                {props.finalData.map((ps: any, i: number) => (
                  <Tr key={i}>
                    <Td>
                      <Box boxSize="6">
                        <Image src={ps.image} />
                      </Box>
                    </Td>
                    <Td align="center">
                      <button onClick={() => props.handlePs(ps.fnftid)}>
                        {ps.fnftid}
                      </button>
                    </Td>
                    <Td align="right">{ps.price} FTM</Td>
                    <Hide below="sm">
                      <Td align="center">
                        {ps.isauction ? "auction" : "sale"}
                      </Td>
                    </Hide>
                    <Hide below="md">
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
      <Box m={6}>
        <button onClick={() => props.setCheckPs(false)}>
          hide PaintSwap offers
        </button>
      </Box>
    </>
  );
}
