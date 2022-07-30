import React, { useState, useEffect } from "react";
import {ExtLink } from "components/ExtLink"
import { useGlobalContext } from "context/context";

const psUrl = "https://paintswap.finance/marketplace/"

export function PaintSwap(props:any)  {

  const { fnftId, setCopy } = useGlobalContext();

  function handlePs(e: string) {
    console.log(e, fnftId);
    setCopy(e);
  }

  return (
    <>
      <div>
        <hr/>
        <p>currently <b>{props.salesArr.length}</b> fNFT offered on PaintSwap:</p>
        <table>
          <tbody>
              <tr className="tb">
                <td>
                  fNFT id
                </td>
                <td>
                  Price
                </td>
                <td>
                  auction?
                </td>
                <td>
                  End time
                </td>
                <td>
                  PS link
                </td>
              </tr>
            {props.salesArr.map((ps: any, i: number) => (
              <tr key={i}>
                <td>
                  <button  onClick={() => handlePs(ps.tokenid)}>
                    {ps.tokenid}
                  </button>
                </td>
                <td>({ps.price} FTM)</td>
                <td>
                    {ps.isauction ? "auction" : "sale" }
                </td>
                <td>
                    {new Date(ps.endtime*1000).toUTCString()}
                </td>
                <td>
                  <a
                    href={psUrl + ps.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ps.id} <ExtLink/>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

