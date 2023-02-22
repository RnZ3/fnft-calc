import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ContentMain } from "components/FnftData";
import { PaintSwap } from "components/PaintSwap";
import { MyGlobalContext } from "context/context";
import { Footer } from "components/Footer";
import { Container } from "@chakra-ui/react";
import { Header } from "components/Header";
import { Inputs } from "components/Inputs";
import { SalesData } from "types/SalesData";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export function App() {
  const [fnftId, setFnftId] = useState<string>("");
  const [idHistory, setIdHistory] = useState<string>("");
  const [fromPs, setFromPs] = useState<boolean>(false);

  const [salesDataG, setSalesDataG] = useState<SalesData[]>([]);


  return (
    <>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <MyGlobalContext.Provider value={{ fnftId, setFnftId, idHistory, setIdHistory, fromPs, setFromPs, salesDataG,setSalesDataG }}>
          <QueryClientProvider client={queryClient}>
            <Container centerContent maxW="100%">
              <Header />
              <Inputs />
              <ContentMain />
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
