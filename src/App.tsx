import React from 'react'
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { ContentMain } from "components/FnftData"
import { fnft_address, fnft_abi } from "contracts/fnftContract"

export default function Parent() {
  const [data, setData] = useState('')
  const [id, setId] = useState('')
  const [lastFnft, setLastFnft] = useState<number>()
  const [submitBtn, setsubmitBtn] = useState(true)

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    // Preventing the page from reloading
    event.preventDefault();
    setData(id);
    setsubmitBtn(!submitBtn)
  }

  useEffect(() => {
    const fetchLastFnftId = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ftm.tools"
      );
      const contract = new ethers.Contract(
        fnft_address,
        fnft_abi,
        provider
      );
      const fnftsCreated = await contract.fnftsCreated();
      setLastFnft(parseInt(fnftsCreated) -1)
    }
    fetchLastFnftId()
  }, []) 

  return (
    <>
      <h1>xLQDR FNFT Rewards Calculator</h1>
      <div className="container">
        <form onSubmit={submitForm}>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            type="number"
            max={lastFnft}
            min="0"
            step="1"
            placeholder="FNFT ID"
            className="input"
          /> {' '}
          <button type="submit" className="btn">Submit</button>
        </form> 
      </div>
      <div>
        <ContentMain formData={data} lastFnft={lastFnft} submitBtn={submitBtn}/>
      </div>
    </>
  )
}
