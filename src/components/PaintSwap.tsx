import React, { useState, useEffect } from "react";
import { ExtLink } from "components/ExtLink";
import { useGlobalContext } from "context/context";

const psItemUrl = "https://paintswap.finance/marketplace/";
const psSalesUrl =
  "https://api.paintswap.finance/v2/sales?onlyActive=true&sold=false&collections[0]=0x58a57754e8d8693703e51604696bd065f25333fd";
var salesData: any[] = [];

export function PaintSwap(props: any) {
  const { fnftId, setFnftId } = useGlobalContext();
  const [error, setError] = useState(null);
  const [metaLoaded, setMetaLoaded] = useState(false);
  const [meta, setMeta] = useState([]);
  const [checkPs, setCheckPs] = useState(false);
  const [saleLoaded, setSaleLoaded] = useState(false);
  const [onsale, setOnsale] = useState([]);

  const fuBar = async (apiRevestUrl: string) => {
    const res = await fetch(apiRevestUrl, { redirect: "follow" });
    res
      .json()
      .then((res) => setMeta(res))
      .catch((err) => setError(err));
  };

  const fetchPs = async () => {
    const res = await fetch(psSalesUrl);
    const json = await res.json();
    setOnsale(json);
    setSaleLoaded(true);
  };

  function handlePs(e: string) {
    console.log(e, fnftId);
    setFnftId(e);
  }

  const fetchMeta = async () => {
    await Promise.all(
      fnftOnsale.sales.map(async (ons: any) => {
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
              psid: ons.id,
              fnftid: ons.tokenId,
              price: ons.price / 1000000000000000000,
              endtime: ons.endTime,
              isauction: ons.isAuction,
              asset: response.properties.asset_name,
            };
            salesData.push(data);
            //return data;
          });
      })
    );
    setMetaLoaded(true);
  };

  useEffect(() => {
    if (checkPs && !saleLoaded) {
      fetchPs();
    }
    if (checkPs && saleLoaded) {
      fetchMeta();
    }
  }, [checkPs, saleLoaded]);

  console.log(checkPs, saleLoaded, metaLoaded);

  const fnftOnsale = JSON.parse(JSON.stringify(onsale));
  salesData.sort((a, b) => parseFloat(a.fnftid) - parseFloat(b.fnftid));

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
                <td align="center">fNFT ID</td>
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
                        ps.fnftid
                      :
                        <button onClick={() => handlePs(ps.fnftid)}>
                          {ps.fnftid}
                        </button>}
                  </td>
                  <td>{ps.asset}</td>
                  <td align="right">{ps.price} FTM</td>
                  <td align="center">{ps.isauction ? "auction" : "sale"}</td>
                  <td>{new Date(ps.endtime * 1000).toUTCString()}</td>
                  <td>
                    <a href={psItemUrl + ps.psid} target="_blank" rel="noreferrer">
                      {ps.psid} <ExtLink />
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
