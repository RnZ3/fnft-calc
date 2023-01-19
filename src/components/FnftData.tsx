import { ExtLink } from "components/ExtLink";
import priceMap from "components/glue.json";
import { FinalArray, TokenData } from "components/interface";
import { useGlobalContext } from "context/context";
import { useMeta, useCoins, useFnft } from "hooks/useMyQueries";
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
} from "@chakra-ui/react";

//const ftmscanUrl = "https://ftmscan.com/address/";
var rewardsAvailable: boolean = false;
var lqdrBalance: number = 0;

export const ContentMain = (props: any) => {
  const { fnftId } = useGlobalContext();
  const [fnftList, setFnftList] = useState(["one"]);
  let appRevestUrl: string = "";
  let lastFnft = props.lastFnft;
  const [error, setError] = useState(null);
  const [ indicators, setIndicators] = useState({
    fnft: "fnft",
    coins: "coins",
    meta: "meta",
  });

  if (fnftId) {
    appRevestUrl = "https://app.revest.finance/?chainId=250&id=" + fnftId;
  }

  const {
    data: fnftData,
    isLoading: rewardsLoading,
    isStale: fnftStale,
  } = useFnft(fnftId);

  const {
    data: coinData,
    isLoading: coinsLoading,
    isStale: coinsStale,
  } = useCoins(fnftId);

  const {
    data: metaData,
    isLoading: metaLoading,
    isStale: metaStale,
  } = useMeta(fnftId);

  /* 
=================== 
  const {
    data: coinData,
    isSuccess: coinsLoaded,
    isLoading: coinsLoading,
    dataUpdatedAt: coinsUpdated,
    isStale: coinsStale,
    isFetching: coinsFetching,
    isRefetching: coinsRefetching,
  } = useQ("coinQ", cgUrl, fnftId, 60000, 60001);
*/

  /*
  useEffect(() => {

    setFnftList(fnftList => [...fnftList,fnftId])

//setSearches(searches => [...searches, query]);
//setList(list.concat(multiElements);

  }, [fnftId,fnftLoaded]);

console.log(fnftList)
*/

  useEffect(() => {
    setIndicators({
      fnft: fnftStale ? "orange" : "limegreen",
      coins: coinsStale ? "orange" : "limegreen",
      meta: metaStale ? "orange" : "limegreen",
    });
    //console.log(indicators);
  }, [coinsStale, fnftStale, metaStale]);

  if (error) {
    return <Box>Error: {error["message"]}</Box>;
  } else if (!fnftId) {
    return <Box>Enter ID (1 - {lastFnft})</Box>;
  }
  if (coinsLoading) {
    return <MsgBox text="Loading coins ..." />;
  }
  if (rewardsLoading) {
    return <MsgBox text="Loading fNFT data ..." />;
  }
  if (metaLoading) {
    return <MsgBox text="Loading metadata ..." />;
  } else {
    const fnftCreateTime = new Date(
      metaData?.properties.created * 1000
    ).toUTCString();
    if (!fnftData?.body.outputMetadata) {
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
      const text =
        "Sorry, ID " +
        fnftId +
        ": " +
        fnftData?.body.outputMetadata.name +
        " is not xLQDR - try different ID";
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
      function mapper(line: any) {
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
    return (
      <>
        <Box>
          <Box>
            <Text fontSize="xl">
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
                    <chakra.span color="#4dd9f6">
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
                      filter: fnftId && fnftStale ? "blur(0.7px)" : "",
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
          <Box sx={{ marginTop: "12px" }}>
            <Text>Rewards available: {rewardsAvailable ? "" : "no"}</Text>
          </Box>
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
                  <Th align="center">CG Id</Th>
                  <Th align="right">Amount</Th>
                  <Th align="right">$ Price</Th>
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
                    <Td>{r.cgname}</Td>
                    <Td
                      align="right"
                      style={{
                        filter: fnftId && fnftStale ? "blur(0.7px)" : "",
                      }}
                    >
                      {r.amount.toFixed(6)}
                    </Td>
                    <Td
                      align="right"
                      style={{
                        filter: fnftId && coinsStale ? "blur(0.7px)" : "",
                      }}
                    >
                      {r.price.toFixed(6)}
                    </Td>
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
                  <Th colSpan={4}></Th>
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
      </>
    );
  }
};

const MsgBox = (props: any) => {
  return (
    <Box>
      <Text fontSize="1.2rem" fontWeight="bold" color="red">
        {props.text}
      </Text>
    </Box>
  );
};

/*
//        <StatusBox props={indicators} />
const StatusBox = (props: any) => {
  return (
    <Box
      sx={{
        display: "inline-block",
        position: "fixed",
        top: "10px",
        right: "10px",
      }}
    >
      <MakeStatusBox item={props?.indicators?.fnft} />
      <MakeStatusBox item={props?.indicators?.coins} />
      <MakeStatusBox item={props?.indicators?.meta} />
    </Box>
  );
};
const MakeStatusBox = (props: any) => {
  return (
    <Box
      sx={{
        display: "inline-block",
        width: "11px",
        height: "11px",
        margin: "0px 1px 0px 0px",
        border: "1px solid #FFFFFF00",
        borderRadius: "20%",
        background: props.item,
        opacity: "50%",
      }}
    ></Box>
  );
};
*/
