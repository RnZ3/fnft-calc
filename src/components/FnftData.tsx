import { ExtLink } from "components/ExtLink";
import priceMap from "components/glue.json";
import { FinalArray, TokenData } from "components/interface";
import { useGlobalContext } from "context/context";
import { useLastFnftId, useMeta, useCoins, useFnft } from "hooks/useMyQueries";
import { useEffect, useState } from "react";
import {
  chakra,
  Divider,
  Image,
  Box,
  Text,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Center,
  Show,
  Hide,
  useColorModeValue,
} from "@chakra-ui/react";
import { MsgBox } from "components/MsgBox";
import { useLocalStorage } from "hooks/useLocalStorage";

//const ftmscanUrl = "https://ftmscan.com/address/";
var rewardsAvailable: boolean = false;
var lqdrBalance: number = 0;
var isXlqdr = { id: "", valid: false };
var loadCoins: boolean = false;

export const ContentMain = () => {
  const { fnftId, setFnftId, idHistory, setIdHistory } = useGlobalContext();
  const [fnftListSt, setFnftListSt] = useLocalStorage<string>(
    "fnftListSt",
    "[]"
  );

  const lqdrColor = useColorModeValue("darkblue", "aqua");

  useEffect(() => {
    setIdHistory(fnftListSt);
    //console.log("idHistory:", idHistory);
  });

  let appRevestUrl: string = "";
  const [error, setError] = useState(null);
  const [indicators, setIndicators] = useState({
    fnft: "fnft",
    coins: "coins",
    meta: "meta",
  });

  if (fnftId) {
    appRevestUrl = "https://app.revest.finance/?chainId=250&id=" + fnftId;
    loadCoins = true;
  }

  const {
    data: lastFnftId,
    isLoading: lastFnftIdLoading,
    isStale: lastFnftIdStale,
  } = useLastFnftId();

  const {
    data: fnftData,
    isLoading: fnftDataLoading,
    isStale: fnftDataStale,
  } = useFnft(fnftId);

  const {
    data: coinData,
    isLoading: coinsLoading,
    isStale: coinsStale,
  } = useCoins(loadCoins);

  const {
    data: metaData,
    isLoading: metaLoading,
    isStale: metaStale,
  } = useMeta(fnftId);

  useEffect(() => {
    const fnftList = idHistory ? JSON.parse(idHistory) : [];
    if (isXlqdr.id !== "" && isXlqdr.valid) {
      if (fnftList.length <= 6) {
        setFnftListSt(
          JSON.stringify(Array.from(new Set([...fnftList, isXlqdr.id])))
        );
      } else {
        if (!fnftList.includes(isXlqdr.id)) {
          const fnftList_shift = fnftList.shift();
          setFnftListSt(
            JSON.stringify(Array.from(new Set([...fnftList, isXlqdr.id])))
          );
        } else {
          console.log("already known:", isXlqdr.id);
        }
      }
    }
    //console.log("effect:", fnftList, isXlqdr.id);
  });

  if (error) {
    return <Box>Error: {error["message"]}</Box>;
  } else if (!fnftId) {
    const text = "Enter ID (1 - " + lastFnftId + ")";
    return <MsgBox text={text} />;
  }
  if (coinsLoading) {
    const text = "Loading coins ...";
    return <MsgBox text={text} />;
  }
  if (fnftDataLoading) {
    const text = "Loading fNFT data ...";
    return <MsgBox text={text} />;
  }
  if (metaLoading) {
    const text = "Loading metadata ...";
    return <MsgBox text={text} />;
  } else {
    const fnftCreateTime = new Date(
      metaData?.properties.created * 1000
    ).toUTCString();
    if (!fnftData?.body.outputMetadata) {
      isXlqdr = { id: fnftId, valid: false };
      const text =
        "Error, no metadata found in " + fnftId + " - try different ID";
      return <MsgBox text={text} />;
    }
    if (
      !(
        fnftData?.body.outputMetadata.name ===
        "Revest Liquid Driver Integration"
      )
    ) {
      isXlqdr = { id: fnftId, valid: false };
      const text =
        "Sorry, ID " +
        fnftId +
        " '" +
        fnftData?.body.outputMetadata.name +
        "' is not xLQDR - try different ID";
      return <MsgBox text={text} />;
    }
    if (fnftData?.body.outputMetadata.front_display[0].value === true) {
      rewardsAvailable = true;
    } else {
      rewardsAvailable = false;
    }
    const image = fnftData?.body.outputMetadata.front_display[1].value;
    if (fnftData?.body.outputMetadata.info_modal[4]) {
      lqdrBalance = fnftData?.body.outputMetadata.info_modal[4].value;
    } else {
      lqdrBalance = -1;
    }
    const smartWalletAddress = fnftData?.body.outputMetadata.info_modal[0].value
      ? fnftData?.body.outputMetadata.info_modal[0].value
      : "unkn";
    const lqdrLocked = fnftData?.body.locked;
    const lqdrUnlockdate = fnftData?.body.unlockDate;
    const xlqdrBalance = fnftData?.body.value;
    const lqdrTimeUTC = new Date(lqdrUnlockdate * 1000).toUTCString();
    const tsNow = Math.floor(Date.now() / 1000);
    const days = Math.floor((lqdrUnlockdate - tsNow) / 86400);
    var ftmPrice: number = 0;
    var lqdrPrice: number = 0;
    coinData?.forEach(function (c: any) {
      if (c.id === "wrapped-fantom") {
        ftmPrice = c.current_price;
      }
      if (c.id === "liquiddriver") {
        lqdrPrice = c.current_price;
      }
    });
    const lqdrUSD = lqdrPrice * lqdrBalance;
    const lqdrFTM = lqdrUSD / ftmPrice;
    const rewards = fnftData?.body.outputMetadata.info_modal[1].value.map(
      function mapper(line: any, i: number) {
        if (typeof line == "string") {
          return line.split(" ");
        } else {
          return line.map(mapper);
        }
      }
    );
    let tokenArray: TokenData[] = [];
    var amount: string = "";
    var amount_n: number;
    var total: number = 0;
    var token: string = "";
    const regex_amount = new RegExp("[0-9]");
    const regex_token = new RegExp("[\\[\\]]");
    rewards?.forEach(function (x: any) {
      x.forEach(function (v: string) {
        if (regex_amount.test(v)) {
          amount = v;
          amount_n = +amount;
        }
        if (regex_token.test(v)) {
          token = v;
        }
      });
      var data: TokenData = { amount: amount_n, token: token };
      tokenArray.push(data);
    });
    var finalData: FinalArray[] = [];
    tokenArray.forEach(function (t) {
      priceMap.forEach(function (m: any) {
        if (t.token === m.rewardtoken) {
          coinData?.forEach(function (c: any) {
            if (c.id === m.cgname) {
              if (!(t.amount === 0)) {
                var data: FinalArray = {
                  value: t.amount * c.current_price,
                  token: t.token,
                  cgname: m.cgname,
                  amount: t.amount,
                  price: c.current_price,
                  image: c.image,
                };
                total += t.amount * c.current_price;
                finalData.push(data);
              }
            }
          });
        }
      });
    });
    const barRight = xlqdrBalance / (lqdrBalance * 0.01);
    const barLeft = 100 - barRight;
    if (!(isXlqdr.id === fnftId)) {
      isXlqdr = { id: fnftId, valid: true };
    }
    return (
      <>
        <Box
          borderTop="1px dotted orange"
          paddingTop="10px"
          m={"0px 5px 0 5px"}
        >
          <Box>
            <Text fontSize={["1rem", null, null, null, "1.3rem"]}>
              fNFT ID:{" "}
              <chakra.span color={lqdrLocked === "locked" ? "orange" : "green"}>
                {fnftId}
              </chakra.span>{" "}
              <small>
                <chakra.span
                  color={lqdrLocked === "locked" ? "orange" : "green"}
                >
                  <Link href={appRevestUrl} target="_blank" rel="noreferrer">
                    manage
                    <ExtLink />
                  </Link>
                </chakra.span>
              </small>
            </Text>
          </Box>
          <Box>
            <Table width="100%">
              <Tbody>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    SmartWallet Address:{" "}
                  </Td>
                  <Td style={{ padding: "0px" }}>{smartWalletAddress}</Td>
                </Tr>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>created:</Td>
                  <Td style={{ padding: "0px" }}>{fnftCreateTime}</Td>
                </Tr>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    {lqdrLocked} {"->"}
                  </Td>
                  <Td style={{ padding: "0px" }}>
                    {lqdrTimeUTC} ({days} days){" "}
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={2} style={{ padding: "0px" }}>
                    <Box
                      sx={{
                        height: "3px",
                        display: "flex",
                        marginTop: "5px",
                        marginBottom: "5px",
                      }}
                    >
                      <Box
                        sx={{ background: "#4dd9f6", width: barLeft + "%" }}
                      ></Box>
                      <Box
                        sx={{ background: "#ffa800", width: barRight + "%" }}
                      ></Box>
                    </Box>
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    LQDR{" "}
                    <Image
                      boxSize="25px"
                      src={image}
                      alt="linked from metadata"
                      sx={{ display: "inline", verticalAlign: "bottom" }}
                    />{" "}
                    Balance:
                  </Td>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    <chakra.span color={lqdrColor}>
                      {lqdrBalance === -1 ? "NaN" : lqdrBalance}{" "}
                    </chakra.span>
                    <chakra.span
                      style={{
                        display: lqdrBalance === -1 ? "hidden" : "",
                        filter: fnftId && coinsStale ? "blur(0.7px)" : "",
                      }}
                    >
                      ($ {lqdrUSD.toFixed(2)}) ({lqdrFTM.toFixed(2)} FTM)
                    </chakra.span>
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>xLQDR Value: </Td>
                  <Td
                    style={{
                      padding: "0px",
                      filter: fnftId && fnftDataStale ? "blur(0.7px)" : "",
                    }}
                  >
                    <chakra.span
                      color={lqdrLocked === "locked" ? "orange" : "hidden"}
                    >
                      {xlqdrBalance}
                    </chakra.span>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Center>
            <Box>
              <Box sx={{ marginTop: "12px" }}>
                <Text>Rewards available: {rewardsAvailable ? "" : "no"}</Text>
              </Box>
              <Box borderBottom="1px dotted orange" paddingBottom="12px">
                <Box
                  style={{
                    display: rewardsAvailable ? "" : "none",
                    marginTop: "12px",
                  }}
                >
                  <Table>
                    <Thead>
                      <Tr>
                        <Th colSpan={2} align="center">
                          Token
                        </Th>
                        <Hide below="md">
                          <Th align="center">CG Id</Th>
                        </Hide>
                        <Th align="right">Amount</Th>
                        <Hide below="md">
                          <Th align="right">$ Price</Th>
                        </Hide>

                        <Th align="right">$ Value</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {finalData.map((r: any, i: number) => (
                        <Tr key={i}>
                          <Td>
                            <Image
                              boxSize="24px"
                              src={r.image}
                              alt="linked from metadata"
                            />
                          </Td>
                          <Td>{r.token}</Td>
                          <Hide below="md">
                            <Td>{r.cgname}</Td>
                          </Hide>
                          <Td
                            align="right"
                            style={{
                              filter:
                                fnftId && fnftDataStale ? "blur(0.7px)" : "",
                            }}
                          >
                            {r.amount.toFixed(6)}
                          </Td>
                          <Hide below="md">
                            <Td
                              align="right"
                              style={{
                                filter:
                                  fnftId && coinsStale ? "blur(0.7px)" : "",
                              }}
                            >
                              {r.price.toFixed(6)}
                            </Td>
                          </Hide>
                          <Td
                            align="right"
                            style={{
                              filter: fnftId && coinsStale ? "blur(0.7px)" : "",
                            }}
                          >
                            {r.value.toFixed(6)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Thead style={{ padding: "4px" }}>
                      <Tr>
                        <Hide below="md">
                          <Th colSpan={2}>2</Th>
                        </Hide>
                        <Th colSpan={2}>2</Th>
                        <Th>Total:</Th>
                        <Th
                          align="right"
                          style={{
                            filter: fnftId && coinsStale ? "blur(0.7px)" : "",
                          }}
                        >
                          {total.toFixed(6)}
                        </Th>
                      </Tr>
                    </Thead>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Center>
        </Box>
      </>
    );
  }
};
