import React, { useState, useEffect } from "react";
import { ExtLink } from "components/ExtLink";
import { useGlobalContext } from "context/context";

const psUrl = "https://paintswap.finance/marketplace/";
const psSales =
  "https://api.paintswap.finance/v2/sales?onlyActive=true&sold=false&collections[0]=0x58a57754e8d8693703e51604696bd065f25333fd";

export function PaintSwap(props: any) {
  const { fnftId, setCopy } = useGlobalContext();
  //const [metaLoaded, setMetaLoaded] = useState(false);
  //const [meta, setMeta] = useState([]);
  const [checkPs, setCheckPs] = useState(false);
  const [saleLoaded, setSaleLoaded] = useState(false);
  const [onsale, setOnsale] = useState([]);
  let salesArr: [] = [];

/*
  const fetchMeta = async () => {
    const res = await fetch(apiRevestUrl, { redirect: 'follow' } )
    res
      .json()
      .then(res => setMeta(res))
      .catch(err => setError(err))
      setMetaLoaded(true)
  }
*/

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

  useEffect(() => {
    //setMetaLoaded(false);
    //setSaleLoaded(false);
    if (checkPs && !saleLoaded) {
      fetchPs();
    }
    //      fetchMeta();
  }, [checkPs]);

  console.log(onsale);

  if (checkPs && saleLoaded && onsale) {
    const fnftOnsale = JSON.parse(JSON.stringify(onsale));
    salesArr = fnftOnsale.sales.map((ons: any) => {
      return {
        id: ons.id,
        tokenid: ons.tokenId,
        price: ons.price / 1000000000000000000,
        endtime: ons.endTime,
        isauction: ons.isAuction,
      };
    });

    return (
      <>
        <div>
          <hr />
          <p>
            currently <b>{salesArr.length}</b> fNFT offered on PaintSwap:
          </p>
          <table>
            <tbody>
              <tr className="tb">
                <td>fNFT id</td>
                <td>Price</td>
                <td>auction?</td>
                <td>End time</td>
                <td>PS link</td>
              </tr>
              {salesArr.map((ps: any, i: number) => (
                <tr key={i}>
                  <td>
                    <button onClick={() => handlePs(ps.tokenid)}>
                      {ps.tokenid}
                    </button>
                  </td>
                  <td>({ps.price} FTM)</td>
                  <td>{ps.isauction ? "auction" : "sale"}</td>
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
  } else if ( checkPs && saleLoaded ) {
    return <p>currently no offers on PaintSwap</p>;
  } else {
    return (
      <>
        <div>
          <hr />
      <p>
        <button onClick={() => setCheckPs(true)}>check PaintSwap offers</button>
      </p>
        </div>
      </>
    );
  }
}
