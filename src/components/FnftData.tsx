import { ExtLink } from "components/ExtLink";
import priceMap from "utils/glue.json";
import { FinalArray, TokenData } from "types/interfaces";
import { useGlobalContext } from "context/context";
import { useLastFnftId, useMeta, useCoins, useFnft } from "hooks/useMyQueries";
import { useEffect, useState } from "react";
import {
  chakra,
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
  Hide,
  useColorModeValue,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
  HStack,
} from "@chakra-ui/react";
import { MsgBox } from "components/MsgBox";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useQueryClient } from "@tanstack/react-query";
import { PsRow } from "components/PsRow";
import theme from "styles/theme";
let colors = require("styles/colors.json");

//const ftmscanUrl = "https://ftmscan.com/address/";
let rewardsAvailable: boolean = false;
let lqdrBalance: number = 0;
let isXlqdr = { id: "", valid: false };
let loadCoins: boolean = false;

export const ContentMain = () => {
  console.log(colors[0].orange);

  const lqdrColor = useColorModeValue("lqblue.light", "lqblue.dark");
  const unlockColor = useColorModeValue("#128db3", "#4dd9f6");
  const idBg = useColorModeValue("#fefefe", "#111111");
  const queryClient = useQueryClient({});
  const data = queryClient.getQueryData(["pswData", true]);
  const { salesDataG } = useGlobalContext();
  const { fnftId, setFnftId, idHistory, setIdHistory } = useGlobalContext();
  const [fnftListSt, setFnftListSt] = useLocalStorage<string>(
    "fnftListSt",
    "[]"
  );

  useEffect(() => {
    setIdHistory(fnftListSt);
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
    isRefetching: fnftDataFetching,
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
      if (fnftList.length <= 7) {
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
          //console.log("already known:", isXlqdr.id);
        }
      }
    }
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
        <Box paddingTop="10px" m={"0px 5px 0 5px"}>
          <Box bgColor={idBg} p={2} textAlign="center">
            <HStack align="center" justify="center">
              <Box>
                <Text
                  display="inline"
                  fontSize={["1.2rem", null, null, null, "1.3rem"]}
                >
                  fNFT ID:{" "}
                  <chakra.span
                    fontWeight="bold"
                    fontSize={[
                      "1.3rem",
                      "1.3rem",
                      "1.4rem",
                      "1.5rem",
                      "1.6rem",
                    ]}
                    color={lqdrLocked === "locked" ? "f_orange" : unlockColor}
                  >
                    {fnftId}
                  </chakra.span>{" "}
                </Text>
              </Box>
              <Box>
                <small>
                  <chakra.span
                    fontSize="0.7rem"
                    color={lqdrLocked === "locked" ? "#ed8936" : "#4dd9f6"}
                  >
                    <Link href={appRevestUrl} target="_blank" rel="noreferrer">
                      manage
                      <ExtLink />
                    </Link>
                  </chakra.span>
                </small>
              </Box>

              {lockCircle(fnftDataStale, fnftDataFetching, barRight)}
            </HStack>
          </Box>
          <Box p={4} background="back">
            <Table width="100%" variant={"simple"}>
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
                    {lqdrTimeUTC} ({days}&nbsp;days){" "}
                  </Td>
                </Tr>
                <Tr>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    LQDR{" "}
                    <Hide below="md">
                      <Image
                        boxSize="25px"
                        src={image}
                        alt="linked from metadata"
                        sx={{ display: "inline", verticalAlign: "bottom" }}
                      />{" "}
                    </Hide>
                    Balance:
                  </Td>
                  <Td style={{ padding: "0px 5px 0px 0px" }}>
                    <chakra.span color="lqdrblue2">
                      {lqdrBalance === -1
                        ? "NaN"
                        : parseFloat(
                            lqdrBalance as unknown as string
                          ).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}{" "}
                    </chakra.span>
                    <chakra.span
                      style={{
                        display: lqdrBalance === -1 ? "hidden" : "",
                        filter: fnftId && coinsStale ? "blur(0.4px)" : "",
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
                      filter: fnftId && fnftDataStale ? "blur(0.4px)" : "",
                    }}
                  >
                    <chakra.span
                      color={lqdrLocked === "locked" ? "f_orange" : "hidden"}
                    >
                      {xlqdrBalance}
                    </chakra.span>
                  </Td>
                </Tr>
                <PsRow
                  fnftId={fnftId}
                  salesDataG={salesDataG}
                  lqdrFTM={lqdrFTM}
                />
              </Tbody>
            </Table>
          </Box>
          <Center>
            <Box>
              <Box sx={{ marginTop: "12px" }}>
                <Text>Rewards available: {rewardsAvailable ? "" : "no"}</Text>
              </Box>
              <Box paddingBottom="12px">
                <Box
                  style={{
                    display: rewardsAvailable ? "" : "none",
                    marginTop: "12px",
                  }}
                >
                  <Table>
                    <Thead>
                      <Tr>
                        <Hide breakpoint="(max-width: 360px)">
                          <Th></Th>
                        </Hide>
                        <Th align="left">Token</Th>

                        <Hide below="md">
                          <Th align="center">CG Id</Th>
                        </Hide>
                        <Th align="right">Amount</Th>
                        <Hide below="sm">
                          <Th align="right">$ Price</Th>
                        </Hide>
                        <Th align="right">$ Value</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {finalData.map((r: any, i: number) => (
                        <Tr key={i}>
                          <Hide breakpoint="(max-width: 360px)">
                            <Td>
                              <Image
                                boxSize="24px"
                                src={r.image}
                                alt="linked from metadata"
                              />
                            </Td>
                          </Hide>
                          <Td>{r.token}</Td>
                          <Hide below="md">
                            <Td>{r.cgname}</Td>
                          </Hide>
                          <Td
                            align="right"
                            style={{
                              filter:
                                fnftId && fnftDataStale ? "blur(0.4px)" : "",
                            }}
                          >
                            {r.amount.toFixed(6)}
                          </Td>
                          <Hide below="sm">
                            <Td
                              align="right"
                              style={{
                                filter:
                                  fnftId && coinsStale ? "blur(0.4px)" : "",
                              }}
                            >
                              {r.price.toFixed(6)}
                            </Td>
                          </Hide>
                          <Td
                            align="right"
                            style={{
                              filter: fnftId && coinsStale ? "blur(0.4px)" : "",
                            }}
                          >
                            {r.value.toFixed(6)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Thead style={{ padding: "4px" }}>
                      <Tr>
                        <Hide breakpoint="(max-width: 360px)">
                          <Th></Th>
                        </Hide>
                        <Hide below="md">
                          <Th></Th>
                        </Hide>
                        <Hide below="sm">
                          <Th></Th>
                        </Hide>
                        <Th colSpan={1}></Th>
                        <Th>Total:</Th>
                        <Th
                          align="right"
                          style={{
                            filter: fnftId && coinsStale ? "blur(0.4px)" : "",
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
function lockCircle(
  fnftDataStale: boolean,
  fnftDataFetching: boolean,
  barRight: number
) {
  return (
    <Box>
      <Tooltip placement="right" label="xLQDR lock ratio">
        <Box display="inline">
          {fnftDataFetching ? (
            <CircularProgress
              size="2.9rem"
              value={barRight}
              color="f_orange"
              trackColor="f_blue"
              thickness="15px"
              isIndeterminate
            />
          ) : (
            <CircularProgress
              size="2.9rem"
              value={barRight}
              color="f_orange"
              trackColor="f_blue"
              thickness="15px"
            >
              <CircularProgressLabel>
                {barRight.toFixed(0)}%
              </CircularProgressLabel>
            </CircularProgress>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}
