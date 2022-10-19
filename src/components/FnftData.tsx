import React, { useState, useEffect } from "react";
import useTimer from "hooks/useTimer";
import Spinner from "components/Spinner";
import { ExtLink } from "components/ExtLink";
import priceMap from "components/glue.json";
import { fnftData, finalArray } from "components/interface";
import { useGlobalContext } from "context/context";

const rewardToken = "liquiddriver,beethoven-x,spell-token,deus-finance-2,wrapped-fantom,spookyswap,linspirit";
const cgUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" + rewardToken;
const psApi = "https://api.paintswap.finance/v2/collections/0x58a57754e8d8693703e51604696bd065f25333fd";
const collectionUrl = "https://paintswap.finance/marketplace/collections/0x58a57754e8d8693703e51604696bd065f25333fd";
const psUrl = "https://paintswap.finance/marketplace/" 
const psSales = "https://api.paintswap.finance/v2/sales?onlyActive=true&sold=false&collections[0]=0x58a57754e8d8693703e51604696bd065f25333fd";
var rewardsAvailable: boolean = false;
var lqdrBalance: number = 0;
var fnftRewards: any = "";
var refreshInterval: number | null = null; // ms or null

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [coinsLoaded, setCoinsLoaded] = useState(false);
  const [fnftLoaded, setFnftLoaded] = useState(false);
  const [coins, setCoins] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [oldFnftId, setOldFnftId] = useState("");

  if (fnftId) {
    lambdaRevestUrl = "https://lambda.revest.finance/api/getUpdatedFNFT/" + fnftId + "-250";
    appRevestUrl = "https://app.revest.finance/?chainId=250&id=" + fnftId;
    apiRevestUrl = "https://api.revest.finance/metadata?id=" + fnftId + "&chainId=250" 
  }

  const fetchCoins = async () => {
    const res = await fetch(cgUrl)
    const json = await res.json()
    setCoins(json)
    setCoinsLoaded(true)
  }

  const fetchFnft = async () => {
    const res = await fetch(lambdaRevestUrl);
    const json = await res.json();
    setRewards(json);
    setFnftLoaded(true);
  };

  useEffect(() => {
    if (fnftId) {
      if (fnftId !== lastFnftId) {
        setIsLoaded(false);
      }
      setFnftLoaded(false);
      setCoinsLoaded(false);
      fetchCoins();
      fetchFnft();
      setLastFnftId(fnftId);
    }
  }, [fnftId, lambdaRevestUrl, submitBtn, refresh ]);

  if (error) {
    return <div>Error: {error["message"]}</div>;
  } else if (!fnftId) {
    return <div>Enter ID (1 - {lastFnft})</div>;
  } else if (!isLoaded) {
    if ((coinsLoaded && fnftLoaded )) {
      setIsLoaded(true);
    }
    return (
      <div>
        <p>Loading ... </p>
      </div>
    );
  } else {

    fnftRewards = JSON.parse(JSON.stringify(rewards));

    if (!fnftRewards.body.outputMetadata) {
      return (
        <>
          <p className="middle warning" >
          Error, no metadata - try different ID
          </p>
        </>
      );
    }

    if (
      !(
        fnftRewards.body.outputMetadata.name ===
        "Revest Liquid Driver Integration"
      )
    ) {
      return (
        <>
          <p className="middle warning" >
            Sorry, ID {fnftId}: "{fnftRewards.body.outputMetadata.name}" is not
            xLQDR - try different ID
          </p>
        </>
      );
    }

    if (fnftRewards.body.outputMetadata.front_display[0].value === true) {
      rewardsAvailable = true;
    } else {
      rewardsAvailable = false;
    }

    const image = fnftRewards.body.outputMetadata.front_display[1].value;
    const farr = fnftRewards.body.outputMetadata.info_modal[1].value.map(
      (rw: any) => rw
    );

    if (fnftRewards.body.outputMetadata.info_modal[4]) {
      lqdrBalance = fnftRewards.body.outputMetadata.info_modal[4].value;
    } else {
      lqdrBalance = -1;
    }

    const lqdrLocked = fnftRewards.body.locked;
    const lqdrUnlockdate = fnftRewards.body.unlockDate;
    const xlqdrBalance = fnftRewards.body.value;
    const lqdrTimeUTC = new Date(lqdrUnlockdate * 1000).toUTCString();
    const tsNow = Math.floor(Date.now() / 1000);
    const days = Math.floor((lqdrUnlockdate - tsNow) / 86400);
    var ftmPrice: number = 0;
    var lqdrPrice: number = 0;

    coins.forEach(function (c: any) {
      if (c.id === "wrapped-fantom") {
        ftmPrice = c.current_price;
      }
      if (c.id === "liquiddriver") {
        lqdrPrice = c.current_price;
      }
    });

    const lqdrUSD = lqdrPrice * lqdrBalance;
    const lqdrFTM = lqdrUSD / ftmPrice;

    var farr2 = farr.map(function mapper(v: any) {
      if (typeof v == "string") {
        return v.split(" ");
      } else {
        return v.map(mapper);
      }
    });

    const farr3: any = JSON.parse(JSON.stringify(farr2));
    let tokenArray: fnftData[] = [];
    var amount: string = "";
    var amount_n: number;
    var total: number = 0;
    var token: string = "";
    const regex_amount = new RegExp("[0-9]");
    const regex_token = new RegExp("[\\[\\]]");

    farr3.forEach(function (x: any) {
      x.forEach(function (v: string) {
        if (regex_amount.test(v)) {
          amount = v;
          amount_n = +amount;
        }
        if (regex_token.test(v)) {
          token = v;
        }
      });
      var data: fnftData = { amount: amount_n, token: token };
      tokenArray.push(data);
    });

    var finalData: finalArray[] = [];

    tokenArray.forEach(function (t) {
      priceMap.forEach(function (m: any) {
        if (t.token === m.rewardtoken) {
          coins.forEach(function (c: any) {
            if (c.id === m.cgname) {
              if (!(t.amount === 0)) {
                var data: finalArray = {
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

    return (
      <>
        <div className="wrapper">
          <p>
            fNFT ID:{" "}
            <span className={lqdrLocked === "locked" ? "orange" : "green"}>
              {fnftId}
            </span>{" "}
            ({lqdrLocked} {"->"} {lqdrTimeUTC} ({days} days)){" "}
            <small>
              {" "}
              <span className={lqdrLocked === "locked" ? "orange" : "green"}>
                <a href={appRevestUrl} target="_blank" rel="noreferrer">
                  extend/claim {fnftId} <ExtLink/>
                </a>{" "}
              </span>{" "}
            </small>
          </p>
          <p>
            LQDR Balance:
            <img className="icon-v" src={image} alt="linked from metadata" />
            <span className="lqdrblue">
              {lqdrBalance === -1 ? "NaN" : lqdrBalance}{" "}
            </span>{" "}
            <span className={lqdrLocked === "locked" ? "orange" : "hidden"}>
              ({xlqdrBalance})
            </span>{" "}
            <span className={lqdrBalance === -1 ? "hidden" : ""}>
              ($ {lqdrUSD.toFixed(2)}) ({lqdrFTM.toFixed(2)} FTM)
            </span>
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
                  <td colSpan={3}></td>
                  <td> </td>
                  <td>Total:</td>
                  <td align="right">{total.toFixed(9)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
};
