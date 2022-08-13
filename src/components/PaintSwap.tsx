import React, { useState, useEffect } from "react";
import Spinner from "components/Spinner";
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
              image: response.image,
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

  if (checkPs && (!saleLoaded || !metaLoaded)) {
    return (
      <div>
        <hr />
        <p>Loading ... </p>
      </div>
    );
  } else if (checkPs && saleLoaded && metaLoaded) {
    var finalData = salesData.reduce(function (result, offer) {
      if (offer.asset === "xLQDR") {
        result.push(offer);
      }
      return result;
    }, []);

    return (
      <>
        <div>
          <hr />
          <p>
            currently <b>{finalData.length}</b> xLQDR fNFT offered on PaintSwap
          </p>
          <div className={finalData.length > 0 ? "scroll" : "hidden"}>
            <table>
              <tbody>
                <tr className="tb">
                  <td align="center" colSpan={2}>
                    fNFT ID
                  </td>
                  <td align="right">Price</td>
                  <td>Type</td>
                  <td>End time</td>
                  <td align="right">visit on PS</td>
                </tr>
                {finalData.map((ps: any, i: number) => (
                  <tr key={i}>
                    <td>
                      <img
                        className="fnft"
                        src={ps.image}
                        height="53px"
                        onClick={() => handlePs(ps.fnftid)}
                      />
                    </td>
                    <td align="center">
                      <button onClick={() => handlePs(ps.fnftid)}>
                        {ps.fnftid}
                      </button>
                    </td>
                    <td align="right">{ps.price} FTM</td>
                    <td align="center">{ps.isauction ? "auction" : "sale"}</td>
                    <td>{new Date(ps.endtime * 1000).toUTCString()}</td>
                    <td align="right">
                      <a
                        href={psItemUrl + ps.psid}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {ps.psid} <ExtLink />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
