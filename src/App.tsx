import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useFetchLastFnftId } from "hooks/useFetchLastFnftId";
import { ContentMain } from "components/FnftData";
import { PaintSwap } from "components/PaintSwap";
import { MyGlobalContext } from "context/context";
import { Footer } from "components/Footer";

const queryClient = new QueryClient();

export function App() {
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [submitBtn, setsubmitBtn] = useState(true);
  const lastFnft = useFetchLastFnftId();
  const [fnftId, setFnftId] = useState<string>("");
  const regex_digit = /^\d*$/;
  const queryParams = new URLSearchParams(window.location.search);
  const qid = queryParams.get("id");

  console.log(qid, lastFnft);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData(id);
    setFnftId(id);
    setsubmitBtn(!submitBtn);
  };

  useEffect(() => {
    setId(fnftId);
  }, [fnftId]);

  useEffect(() => {
    if (qid !== null && regex_digit.test(qid) && parseInt(qid) <= lastFnft) {
      setFnftId(qid);
    }
  }, [qid, lastFnft]);

  return (
    <>
      <MyGlobalContext.Provider value={{ fnftId, setFnftId }}>
        <QueryClientProvider client={queryClient}>
          <h1>
            <a
              href="/"
              onClick={() => {
                window.location.reload();
              }}
            >
              xLQDR fNFT Rewards Calculator
            </a>
          </h1>
          <div className="container">
            <form onSubmit={submitForm}>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                type="number"
                max={lastFnft}
                min="1"
                step="1"
                placeholder="fNFT ID"
                className="input"
              />{" "}
              <button type="submit" className="btn">
                Submit
              </button>
            </form>
          </div>
          <div>
            <ContentMain
              newId={data}
              lastFnft={lastFnft}
              submitBtn={submitBtn}
            />
            <PaintSwap />
            <Footer />
          </div>
      <ReactQueryDevtools  />
        </QueryClientProvider>
      </MyGlobalContext.Provider>
    </>
  );
}
