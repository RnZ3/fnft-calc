import React, { useState, useEffect } from "react";
import { ExtLink } from "components/ExtLink";
import { useGlobalContext } from "context/context";

const psUrl = "https://paintswap.finance/marketplace/";
const psSales =
  "https://api.paintswap.finance/v2/sales?onlyActive=true&sold=false&collections[0]=0x58a57754e8d8693703e51604696bd065f25333fd";
var salesData: any[] = [];

export function PaintSwap(props: any) {
  const { fnftId, setCopy } = useGlobalContext();
  const [error, setError] = useState(null);
  const [metaLoaded, setMetaLoaded] = useState(false);
  const [meta, setMeta] = useState([]);
  const [checkPs, setCheckPs] = useState(false);
  const [saleLoaded, setSaleLoaded] = useState(false);
  const [onsale, setOnsale] = useState([]);
  let salesArr: [] = [];

  const fuBar = async (apiRevestUrl: string) => {
    const res = await fetch(apiRevestUrl, { redirect: "follow" });
    res
      .json()
      .then((res) => setMeta(res))
      .catch((err) => setError(err));
    //      setMetaLoaded(true)
  };

  const fetchPs = async () => {
    const res = await fetch(psSales);
    const json = await res.json();
    setOnsale(json);
    setSaleLoaded(true);
  };

  function handlePs(e: string) {
    console.log(e, fnftId);
    setCopy(e);
  }

  const fetchMeta = async () => {
    await Promise.all(
      (salesArr = fnftOnsale.sales.map(async (ons: any) => {
        const apiRevestUrl =
          "https://api.revest.finance/metadata?id=" +
          ons.tokenId +
          "&chainId=250";

        await fetch(apiRevestUrl || "")
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            const data: any = {
              id: ons.id,
              tokenid: ons.tokenId,
              price: ons.price / 1000000000000000000,
              endtime: ons.endTime,
              isauction: ons.isAuction,
              asset: response.properties.asset_name,
            };
            salesData.push(data);
            console.log("inside map");
            return data;
          });
      }))
    );
    setMetaLoaded(true);
  };

  useEffect(() => {
    //setMetaLoaded(false);
    //setSaleLoaded(false);
    if (checkPs && !saleLoaded) {
      fetchPs();
    }
    if (checkPs && saleLoaded) {
      fetchMeta();
    }
    //      fetchMeta();
  }, [checkPs, saleLoaded]);

  console.log(checkPs, saleLoaded, metaLoaded);

  const fnftOnsale = JSON.parse(JSON.stringify(onsale));

  //console.log(salesArr)
  console.log(salesData);

  if (checkPs && saleLoaded && metaLoaded) {
    return (
      <>
        <div>
          <hr />
          <p>
            currently <b>{salesData.length}</b> fNFT offered on PaintSwap:
          </p>
          <table>
            <tbody>
              <tr className="tb">
                <td align="center">fNFT id</td>
                <td>Asset name</td>
                <td>Price</td>
                <td>Auction?</td>
                <td>End time</td>
                <td>PS link</td>
              </tr>
              {salesData.map((ps: any, i: number) => (
                <tr key={i}>
                  <td align="center">
                    {ps.asset !== "xLQDR"
                      ?
                        ps.tokenid
                      :
                        <button onClick={() => handlePs(ps.tokenid)}>
                          {ps.tokenid}
                        </button>}
                  </td>
                  <td>{ps.asset}</td>
                  <td align="right">{ps.price} FTM</td>
                  <td align="center">{ps.isauction ? "auction" : "sale"}</td>
                  <td>{new Date(ps.endtime * 1000).toUTCString()}</td>
                  <td>
                    <a href={psUrl + ps.id} target="_blank" rel="noreferrer">
                      {ps.id} <ExtLink />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <hr />
          <p>
            <button onClick={() => setCheckPs(true)}>
              check PaintSwap offers
            </button>
          </p>
        </div>
      </>
    );
  }
}
