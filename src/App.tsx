import React, { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useFetchLastFnftId } from "hooks/useFetchLastFnftId";
import { ContentMain } from "components/FnftData";
import { PaintSwap } from "components/PaintSwap";
import { MyGlobalContext } from "context/context";
import { Footer } from "components/Footer";
import { Button, Input, Container, Box } from "@chakra-ui/react";
import { Header } from "components/Header";
//import "styles/styles.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

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
    // eslint-disable-next-line
  }, [qid, lastFnft]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <MyGlobalContext.Provider value={{ fnftId, setFnftId }}>
          <QueryClientProvider client={queryClient}>
            <Container centerContent maxW="100%">
              <Header />
              <Box sx={{ marginBottom: "12px" }}>
                <form onSubmit={submitForm}>
                  <Input
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    type="number"
                    max={lastFnft}
                    min="1"
                    step="1"
                    placeholder="fNFT ID"
                  />{" "}
                  <Button type="submit">submit</Button>
                </form>
              </Box>
              <ContentMain
                newId={data}
                lastFnft={lastFnft}
                submitBtn={submitBtn}
              />
              <PaintSwap />
              <Footer />
            </Container>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </MyGlobalContext.Provider>
      </ChakraProvider>
    </>
  );
}
