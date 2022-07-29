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
            {props.salesArr.map((ps: any, i: number) => (
              <tr key={i}>
                <td>
                  <button  onClick={() => handlePs(ps.tokenid)}>
                    {ps.tokenid}
                  </button>
                </td>
                <td>({ps.price} FTM)</td>
                <td>
                  <a
                    href={psUrl + ps.id}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ps.id} <ExtLink/>
                  </a>
                </td>
                <td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

