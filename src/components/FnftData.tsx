import { ExtLink } from "components/ExtLink";
import { useQuery } from "@tanstack/react-query";
import priceMap from "components/glue.json";
import { FinalArray, TokenData } from "components/interface";
import { useGlobalContext } from "context/context";
import useTimer from "hooks/useTimer";
import { useEffect, useState } from "react";

const rewardToken =
  "liquiddriver,beethoven-x,spell-token,deus-finance-2,wrapped-fantom,spookyswap,linspirit";
const cgUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
  rewardToken;
const ftmscanUrl = "https://ftmscan.com/address/";
var rewardsAvailable: boolean = false;
var lqdrBalance: number = 0;
var refreshInterval: number | null = null; // ms or null

async function fetchData(URL: string) {
  const res = await fetch(URL || "");
  return res.json();
}

const STALE_T_FNFT = 60000;
const STALE_T_COINS = 60000;
const STALE_T_META = 120000; //Infinity;
const REFRESH_INTERVAL = 180000;

export const ContentMain = (props: any) => {
  const { fnftId, setFnftId } = useGlobalContext();
  let lambdaRevestUrl: string = "";
  let appRevestUrl: string = "";
  let apiRevestUrl: string = "";
  let lastFnft = props.lastFnft;
  let submitBtn = props.submitBtn;
  const refresh = useTimer(refreshInterval);
  const [error, setError] = useState(null);
  const [lastFnftId, setLastFnftId] = useState("");
  const [oldFnftId, setOldFnftId] = useState("");
  const [metaI, setMetaI] = useState("");
  const [fnftI, setFnftI] = useState("");
  const [coinI, setCoinI] = useState("");

  if (fnftId) {
    lambdaRevestUrl =
      "https://lambda.revest.finance/api/getUpdatedFNFT/" + fnftId + "-250";
    appRevestUrl = "https://app.revest.finance/?chainId=250&id=" + fnftId;
    apiRevestUrl =
      "https://api.revest.finance/metadata?id=" + fnftId + "&chainId=250";
  }

  const {
    data: coinData,
    isSuccess: coinsLoaded,
    isLoading: coinsLoading,
    dataUpdatedAt: coinsUpdated,
    isStale: coinsStale,
    isFetching: coinsFetching,
    isRefetching: coinsRefetching,
  } = useQuery({
    queryKey: ["coinData", cgUrl],
    queryFn: () => fetchData(cgUrl),
    enabled: !!fnftId,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_T_COINS,
  });

  const {
    data: fnftData,
    isSuccess: fnftLoaded,
    isLoading: rewardsLoading,
    dataUpdatedAt: rewardsUpdated,
    isStale: fnftStale,
  } = useQuery({
    queryKey: ["fnftData", lambdaRevestUrl],
    queryFn: () => fetchData(lambdaRevestUrl),
    enabled: !!fnftId,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_T_FNFT,
  });

  const {
    data: metaData,
    isSuccess: metaLoaded,
    isLoading: metaLoading,
    dataUpdatedAt: metaUpdated,
    isStale: metaStale,
  } = useQuery({
    queryKey: ["metaData", apiRevestUrl],
    queryFn: () => fetchData(apiRevestUrl),
    enabled: !!fnftId,
    refetchInterval: REFRESH_INTERVAL,
    staleTime: STALE_T_META,
  });

  useEffect(() => {
    setCoinI(coinsStale ? "box borange" : "box bgreen");
    setFnftI(fnftStale ? "box borange" : "box bgreen");
    setMetaI(metaStale ? "box borange" : "box bgreen");
  }, [
    metaUpdated,
    coinsUpdated,
    rewardsUpdated,
    coinsStale,
    fnftStale,
    metaStale,
    coinI,
    metaI,
    fnftI,
  ]);

  if (error) {
    return <div>Error: {error["message"]}</div>;
  } else if (!fnftId) {
    return <div>Enter ID (1 - {lastFnft})</div>;
  } else if (coinsLoading) {
    return (
      <div>
        <p>Loading coins ... </p>
      </div>
    );
  }
  if (rewardsLoading) {
    return (
      <div>
        <p>Loading fNFT data ... </p>
      </div>
    );
  }
  if (metaLoading) {
    return (
      <div>
        <p>Loading metadata ... </p>
      </div>
    );
  } else {
    const fnftCreateTime = new Date(
      metaData?.properties.created * 1000
    ).toUTCString();

    if (!fnftData?.body.outputMetadata) {
      return (
        <p className="middle warning">Error, no metadata - try different ID</p>
      );
    }

    if (
      !(
        fnftData?.body.outputMetadata.name ===
        "Revest Liquid Driver Integration"
      )
    ) {
      return (
        <p className="middle warning">
          Sorry, ID {fnftId}: "{fnftData?.body.outputMetadata.name}" is not
          xLQDR - try different ID
        </p>
      );
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

    const fraction1 = lqdrBalance / 100; // 1%
    const fraction2 = lqdrBalance * 0.01; // 1%
    const rest = xlqdrBalance / fraction2; // teiler prozent
    const lost = 100 - rest;

    const links = lost;
    const rechts = rest;

    console.log(fraction1, fraction2, rest, lost);

    return (
      <>
        <div className="wrapper">
          <div className="wrapper2">
            <p>
              fNFT ID:{" "}
              <span className={lqdrLocked === "locked" ? "orange" : "green"}>
                {fnftId}
              </span>{" "}
              ({lqdrLocked} {"->"} <span className="white">{lqdrTimeUTC}</span>{" "}
              ({days} days)){" "}
              <small>
                <span className={lqdrLocked === "locked" ? "orange" : "green"}>
                  <a href={appRevestUrl} target="_blank" rel="noreferrer">
                    manage
                    <ExtLink />
                  </a>
                </span>
              </small>
            </p>
            <div className="xbarcontainer">
              <div
                className="xbar"
                style={{ background: "#4dd9f6", width: links + "%" }}
              ></div>
              <div
                className="xbar"
                style={{ background: "#ffa800", width: rechts + "%" }}
              ></div>
            </div>
          </div>
          <p>
            LQDR Balance:
            <img className="icon-v" src={image} alt="linked from metadata" />
            <span className="lqdrblue">
              {lqdrBalance === -1 ? "NaN" : lqdrBalance}{" "}
            </span>
            <span className={lqdrBalance === -1 ? "hidden" : ""}>
              ($ {lqdrUSD.toFixed(2)}) ({lqdrFTM.toFixed(2)} FTM)
            </span>{" "}
            <br />
            xLQDR Value:{" "}
            <span className={lqdrLocked === "locked" ? "orange" : "hidden"}>
              {xlqdrBalance}
            </span>{" "}
            <br />
          </p>
          <p>
            Smart Wallet Address:{" "}
            <span className="white">
              <a href={ftmscanUrl + smartWalletAddress}>{smartWalletAddress}</a>
            </span>
            {"  "}
            <br />
            created: <span className="white">{fnftCreateTime}</span>
          </p>
          <p>Rewards available: {rewardsAvailable ? "" : "no"}</p>
          <div className={rewardsAvailable ? "" : "hidden"}>
            <table>
              <tbody>
                <tr className="tb">
                  <td colSpan={2}>Token</td>
                  <td>CG Id</td>
                  <td align="right">Amount</td>
                  <td align="right">$ Price</td>
                  <td align="right">$ Value</td>
                </tr>
                {finalData.map((r: any, i: number) => (
                  <tr key={i}>
                    <td>
                      <img
                        className="icon-v"
                        src={r.image}
                        alt="linked from metadata"
                      />
                    </td>
                    <td>{r.token}</td>
                    <td>{r.cgname}</td>
                    <td align="right">{r.amount.toFixed(6)}</td>
                    <td align="right">{r.price.toFixed(6)}</td>
                    <td align="right">{r.value.toFixed(6)}</td>
                  </tr>
                ))}
                <tr className="tb">
                  <td colSpan={4}></td>

                  <td>Total:</td>
                  <td align="right">{total.toFixed(6)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bbox">
          <div className={fnftI}></div>
          <div className={coinI}></div>
          <div className={metaI}></div>
        </div>
      </>
    );
  }
};
