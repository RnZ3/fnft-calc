import React, { useState, useEffect } from "react";
import { useFetchLastFnftId } from "hooks/useFetchLastFnftId";
import { ContentMain } from "components/FnftData";
import { PaintSwap } from "components/PaintSwap";
import { MyGlobalContext } from "context/context";
import { Footer } from "components/Footer";

export function App() {
  const [data, setData] = useState("");
  const [id, setId] = useState("");
  const [submitBtn, setsubmitBtn] = useState(true);
  const lastFnft = useFetchLastFnftId();

  const [fnftId, setCopy] = useState<string>("");

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData(id);
    setCopy(id);
    setsubmitBtn(!submitBtn);
  };

  useEffect(() => {
    setId(fnftId);
  }, [fnftId]);

//  console.log(fnftId);

  return (
    <>
      <MyGlobalContext.Provider value={{ fnftId, setCopy }}>
        <h1>xLQDR fNFT Rewards Calculator</h1>
        <div className="container">
          <form onSubmit={submitForm}>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              type="number"
              max={lastFnft}
              min="0"
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
          <ContentMain newId={data} lastFnft={lastFnft} submitBtn={submitBtn} />
          <PaintSwap/>
          <Footer/>
        </div>
      </MyGlobalContext.Provider>
    </>
  );
}
