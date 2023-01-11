import React from "react"
import { ghLogo, ghLogoAlt } from "img/gh-mark";

export function Footer()  {
  return (
    <>
      <div className="footer">
        <small>
          NFA, DYOR -- thanks revest.finance, liquiddriver.finance,
          paintswap.finance, coingecko.com, vercel.com, github.com,
          ftm.tools -- <a href="https://github.com/RnZ3/fnft-calc">
            source code{" "}
            <img src={ghLogo} className="smaller" alt="gh logo"/>
          </a>
        </small>
      </div>
    </>
  )
}

