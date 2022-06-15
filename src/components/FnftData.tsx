import React, { useState, useEffect }  from 'react';
import priceMap from "components/glue.json";
import { fnftData, finalArray } from "components/interface";

var fnftId:number = -1
const rewardToken  = 'liquiddriver,beethoven-x,spell-token,deus-finance,wrapped-fantom,spookyswap,linspirit,boo-mirrorworld,hundred-finance'
const cgUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + rewardToken
var fnftUrl = 'https://lambda.revest.finance/api/getUpdatedFNFT/' + fnftId + '-250'
var rewardsAvailable:boolean = false
var lqdrBalance:number = 0
var fnftRewards:any = ""
const REFRESH_INTERVAL = 120000

export const ContentMain = (props:any) => {

  let fnftId = props.formData
  let lastFnft = props.lastFnft
  let submitBtn = props.submitBtn

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoaded1, setIsLoaded1] = useState(false);
  const [isLoaded2, setIsLoaded2] = useState(false);
  const [coins, setCoins] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [refresh, setRefresh] = useState(new Date());

  useEffect(() => {
    var timerID = setInterval(() => timer(), REFRESH_INTERVAL)
    return () => clearInterval(timerID)
  }, [ ])

  function timer() {
      setRefresh(new Date())
  }

  if(fnftId) {
    fnftUrl = 'https://lambda.revest.finance/api/getUpdatedFNFT/' + fnftId + '-250'
  }

  useEffect(() => {
    const fetchData1 = async () => {
      const res = await fetch(cgUrl)
      const json = await res.json();
      setCoins(json);
      setIsLoaded1(true);
    }
    setIsLoaded1(false);
    if(fnftId) {
      fetchData1()
    }
  }, [ fnftId, submitBtn, refresh ])

  useEffect(() => {
    const fetchData2 = async () => {
      const res = await fetch(fnftUrl)
      const json = await res.json();
      setRewards(json);
      setIsLoaded2(true);
    }
    setIsLoaded2(false);
    if(fnftId) {
      fetchData2()
    }
  }, [ fnftId, submitBtn, refresh ])

  if (error) {
      return <div>Error: {error['message']}</div>;
  } else if (!fnftId) {
      return <div>Enter ID  (0 - {lastFnft})</div>;
  } else if ( !isLoaded ) {
    if ((isLoaded1) && (isLoaded2)) {
      setIsLoaded(true);
    }
    console.log("loaded: ",isLoaded, fnftId)
    return <div>Loading...</div>;
  } else {

    fnftRewards = JSON.parse(JSON.stringify(rewards))
    
    if(! fnftRewards.body.outputMetadata) { 
      return <><div>Error, no metadata - try different ID</div></>; 
    }

    if(! (fnftRewards.body.outputMetadata.name === "Revest Liquid Driver Integration")) { 
      return <><p className="middle">Sorry, ID {fnftId}: "{fnftRewards.body.outputMetadata.name}" 
          is not xLQDR - try different ID</p></>; 
    }

    if(fnftRewards.body.outputMetadata.front_display[0].value === true) { 
      rewardsAvailable = true 
    } else {
      rewardsAvailable = false 
    }

    const image = (fnftRewards.body.outputMetadata.front_display[1].value)
    const farr = (fnftRewards.body.outputMetadata.info_modal[1].value.map((rw:any) => (rw) )) 

    if(fnftRewards.body.outputMetadata.info_modal[4]) { 
      lqdrBalance = (fnftRewards.body.outputMetadata.info_modal[4].value) 
    } else {
      lqdrBalance = -1
    }

    const lqdrLocked = (fnftRewards.body.locked) 
    const lqdrUnlockdate = (fnftRewards.body.unlockDate) 
    const xlqdrBalance = (fnftRewards.body.value) 
    const lqdrTimeUTC = new Date(lqdrUnlockdate*1000).toUTCString()
    const tsNow = Math.floor(Date.now() / 1000)
    const days = Math.floor((lqdrUnlockdate-tsNow)/86400)
    var ftmPrice:number = 0
    var lqdrPrice:number = 0

    coins.forEach(function(c:any) {
      if (c.id === "wrapped-fantom") {
        ftmPrice = c.current_price
      }
      if (c.id === "liquiddriver") {
        lqdrPrice = c.current_price
      }
    })

    const lqdrUSD = (lqdrPrice * lqdrBalance)
    const lqdrFTM = (lqdrUSD / ftmPrice)

    var farr2 = farr.map(function mapper(v:any){
        if(typeof v == "string"){
          return v.split(" ");
        } else {
        return v.map(mapper);
        }
    });

    const farr3: any = JSON.parse(JSON.stringify(farr2))
    let tokenArray:fnftData[] = [];
    var amount: string = ""
    var amount_n: number 
    var total: number = 0
    var token: string = ""
    const regex_amount = new RegExp('[0-9]');
    const regex_token = new RegExp('[\\[\\]]');

    farr3.forEach(function (x:any){
      x.forEach(function (v:string) {
        if(regex_amount.test(v)) {
          amount = v
          amount_n = +amount
        }
        if(regex_token.test(v)) {
          token = v
        }
      })
      var data:fnftData = { amount: amount_n, token: token }
      tokenArray.push(data)
    });

    var finalData:finalArray[] = [];

    tokenArray.forEach(function (t) {
      priceMap.forEach(function (m:any) {
        if (t.token === m.rewardtoken) {
          coins.forEach(function (c:any) {
            if (c.id === m.cgname) {
              if( ! (t.amount === 0)) {
                var data:finalArray = { token: t.token, cgname: m.cgname, amount: t.amount, price: c.current_price, image: c.image }
                total += (t.amount * c.current_price)
                finalData.push(data)
              }
            }
          })
        }
      })
    })

    return (
     <>
      <div className="wrapper">
        <p>FNFT ID: <span className={(lqdrLocked === "locked") ? "orange" : "green"}>{fnftId}</span>{' '}
            ({lqdrLocked} {'->'} {lqdrTimeUTC} ({days} days))</p>
        <p>LQDR Balance: 
            <img className="icon-v" src={image} alt="linked from metadata"/>
            <span className="lqdrblue">{ (lqdrBalance === -1) ? "NaN" : lqdrBalance } </span>{' '}
            <span className={(lqdrLocked === "locked") ? "orange" : "hidden"}>({xlqdrBalance})</span>{' '}
            <span className={(lqdrBalance === -1) ? "hidden" : "" } >($ {lqdrUSD.toFixed(2)}) ({lqdrFTM.toFixed(2)} FTM)</span></p>
        <p>Rewards available: {rewardsAvailable ? "" : "no" }</p>
        <div className={rewardsAvailable ? "tb" : "hidden"}>
          <table>
            <tbody>
              <tr className="tb">
                <td colSpan={2}>Token</td>
                <td>CG Id</td>
                <td>Amount</td>
                <td>$ Price</td>
                <td>$ Value</td>
              </tr>
              {finalData.map((r:any, i:number) => (
                <tr key={i}>
                  <td><img className="icon-v" src={r.image} alt="linked from metadata" /></td>
                  <td>{r.token}</td>
                  <td>{r.cgname}</td>
                  <td>{r.amount}</td>
                  <td>{r.price}</td>
                  <td>{r.price * r.amount}</td>
                </tr>
              ))}
                <tr className="tb">
                  <td colSpan={3}>
                  </td>
                  <td> </td>
                  <td>Total:</td>
                  <td>{total}</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p><small>thanks revest.finance, liquiddriver.finance, coingecko.com, vercel.com, ftm.tools -- NFA, DYOR</small></p>
      </div>
     </>
    );
  }
}

