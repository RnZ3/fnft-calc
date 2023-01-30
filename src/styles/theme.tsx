import { extendTheme } from "@chakra-ui/react";
import type { ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const overrides = {
  fonts: {
    heading: `'monospace', sans-serif`,
    body: `'monospace', sans-serif`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      a: {
        color: props.colorMode === "dark" ? "teal.300" : "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
      body: {
        fontFamily: "monospace",
        fontSize: "1.1rem",
        color: mode("#222", "#CCC")(props),
        background: mode("#EEE", "#222")(props),
      },
      table: {
        background: mode("#EEE", "#222")(props),
      },
      thead: {
        background: mode("#999", "#000")(props),
        color: mode("#ffa800", "#ffa800")(props),
        fontWeight: "bold",
      },
      tbody: {
        background: mode("whiteAlpha.900", "#222")(props),
      },
      tr: {
        background: mode("whiteAlpha.900", "#222")(props),
      },
      th: {
        background: mode("#dddddd", "#111111")(props),
        padding: "10px",
      },
      td: {
        background: mode("#EEE", "#222")(props),
        padding: "10px",
      },
      _placeholder: {
        color: "grey",
      },
      form: {
        margin: "0",
      },
      input: {
        background: "whiteAlpha.900",
        color: "blackAlpha.900",
        border: mode("1px dotted black", "1px dotted red")(props),
        fontSize: "0.9rem",
        textAlign: "center",
        width: "5rem",
      },
      button: {
        background: "#CCC",
        color: "black",
        borderRadius: "3px",
        padding: "3px",
        fontSize: "0.8rem",
        fontWeight: "600",
      },
    }),
  },
  components: () => ({
    Container: {
      variants: {
        withMargin: {
          marginTop: "44px",
        },
      },
    },
    Link: {},
  }),
};

export const theme = extendTheme(config, overrides);
export default theme;
