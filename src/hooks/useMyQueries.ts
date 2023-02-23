import { ethers } from "ethers";
import { fnft_address, fnft_abi } from "contracts/fnftContract";

import { useQuery, useQueries } from "@tanstack/react-query";

const STALE_FNFT = 180000;
const STALE_COINS = 180000;
const STALE_META = Infinity;
const REFETCH_INTERVAL = 200000;
const CACHE_TIME = Infinity;

const revestUrlStart = "https://lambda.revest.finance/api/getUpdatedFNFT/";
const revestUrlEnd = "-250";
const rewardToken =
  "liquiddriver,beethoven-x,spell-token,deus-finance-2,wrapped-fantom,spookyswap,linspirit";
const cgUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=" +
  rewardToken;
const apiRevestStart = "https://api.revest.finance/metadata?id=";
const apiRevestEnd = "&chainId=250";
const psSalesUrl =
  "https://api.paintswap.finance/v2/sales?showUnverified=true&collections[0]=0xa6f5efc3499d41ff1eca9d325cfe13c913a85f45&version=2";

async function fetchData(URL: string) {
  const response = await fetch(URL || "");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

const fetchLastFnftId = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ftm.tools"
  );
  const contract = new ethers.Contract(fnft_address, fnft_abi, provider);
  const fnftsCreated = await contract.fnftsCreated();
  return fnftsCreated - 1;
};

export const useLastFnftId = () =>
  useQuery({
    queryKey: ["lastFnft"],
    queryFn: () => fetchLastFnftId(),
    refetchInterval: 0,
    refetchIntervalInBackground: false,
    cacheTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    placeholderData: 0,
    staleTime: Infinity,
  });

export const useFnft = (fnftId: string) =>
  useQuery({
    queryKey: ["fnftData", fnftId],
    queryFn: () => fetchData(revestUrlStart + fnftId + revestUrlEnd),
    refetchInterval: 90000,
    refetchIntervalInBackground: false,
    staleTime: 60000,
    cacheTime: CACHE_TIME,
    enabled: !!fnftId,
  });

export const useCoins = (enabled: boolean) =>
  useQuery({
    queryKey: ["coinData", enabled],
    queryFn: () => fetchData(cgUrl),
    enabled: !!enabled,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    cacheTime: CACHE_TIME,
    staleTime: STALE_COINS,
  });

export const useMeta = (fnftId: string) =>
  useQuery({
    queryKey: ["metaData", fnftId],
    queryFn: () => fetchData(apiRevestStart + fnftId + apiRevestEnd),
    enabled: !!fnftId,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    cacheTime: CACHE_TIME,
    staleTime: STALE_META,
  });

export const usePsw = (fnftId: boolean) =>
  useQuery({
    queryKey: ["pswData", fnftId],
    queryFn: () => fetchData(psSalesUrl),
    enabled: !!fnftId,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: STALE_COINS,
  });

export const usePswMeta1 = (pswData: any) =>
  useQuery({
    queryKey: ["pswMeta", pswData],
    queryFn: () => fetchData(psSalesUrl),
    enabled: !!pswData,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: STALE_COINS,
  });

export const usePswMeta = (pswl: boolean, pswData: any) => {
  return useQueries({
    queries: (pswData?.sales || []).map((onsale: any) => ({
      queryKey: ["pswSale", onsale.tokenId],
      queryFn: () =>
        fetchData(
          "https://api.revest.finance/metadata?id=" +
            onsale.tokenId +
            "&chainId=250"
        ),
      refetchInterval: 0,
      refetchIntervalInBackground: false,
      staleTime: STALE_META,
      enabled: !!pswl,
    })),
  });
};

export const useQ = (
  qName: string,
  URL: string,
  fnftId: string,
  stTime: number,
  chTime: number
) =>
  useQuery({
    queryKey: [qName, URL],
    queryFn: () => fetchData(URL),
    enabled: !!fnftId,
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: stTime,
    cacheTime: chTime,
  });

/*
=================== 
  const {
    data: coinData,
    isSuccess: coinsLoaded,
    isLoading: coinsLoading,
    dataUpdatedAt: coinsUpdated,
    isStale: coinsStale,
    isFetching: coinsFetching,
    isRefetching: coinsRefetching,
  } = useQ("coinQ", cgUrl, fnftId, 60000, 60001);
*/
