import { Container, Text, Link, Center } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export function Footer() {
  return (
    <Container
      centerContent
      maxW="100%"
      sx={{ borderTop: "1px dotted orange" }}
    >
      <Center>
        <Text
          fontSize={["0.5rem", "0.6rem", "0.7rem", "0.8rem", "0.9rem"]}
          align="center"
        >
          NFA, DYOR -- thanks revest.finance, liquiddriver.finance,
          paintswap.finance, coingecko.com, vercel.com, github.com, ftm.tools --{" "}
          <Link href="https://github.com/RnZ3/fnft-calc">
            source code <ExternalLinkIcon w={3} h={3} />
          </Link>
        </Text>
      </Center>
    </Container>
  );
}
