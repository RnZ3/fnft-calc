import { chakra, Text } from "@chakra-ui/react";
import { ColorModeSwitcher } from "components/ColorModeSwitcher";
import { useFnft, useCoins, useMeta } from "hooks/useMyQueries";
import { useGlobalContext } from "context/context";

export const Header = () => {
  const { fnftId } = useGlobalContext();
  const { isStale: fnftStale } = useFnft(fnftId);
  const { isStale: coinsStale } = useCoins(fnftId);
  const { isStale: metaStale } = useMeta(fnftId);

  return (
    <Text fontSize="2.3rem" fontWeight="bold" sx={{ marginTop: "1rem" }}>
      <chakra.span style={{ filter: fnftId && fnftStale ? "blur(1px)" : "" }}>
        <chakra.span style={{ filter: fnftId && metaStale ? "blur(1px)" : "" }}>
          <chakra.span
            style={{ filter: fnftId && coinsStale ? "blur(1px)" : "" }}
          >
            xLQDR fNFT Expl
            <ColorModeSwitcher />
            rer
          </chakra.span>
        </chakra.span>
      </chakra.span>
    </Text>
  );
};