import { useEffect, useState } from "react"
import { ethers } from "ethers";
import { fnft_address, fnft_abi } from "contracts/fnftContract"

export function useFetchLastFnftId()  {
  const [lastFnft, setLastFnft] = useState<number>(9999)
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
  return lastFnft
}

