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
      "*, *::before, ::after": {
        overflowWrap: "anywhere",
      },
      a: {
        color: props.colorMode === "dark" ? "teal.300" : "teal.500",
        _hover: {
          textDecoration: "underline",
        },
      },
      body: {
        fontFamily: "monospace",
        fontSize: ["0.8rem", "0.9rem", "1rem", "1.1rem", "1.2rem"],
        color: mode("#222", "#CCC")(props),
        background: mode("#DDD", "#333")(props),
      },
      table: {
        background: mode("#EEE", "#222")(props),
      },
      thead: {
        background: mode("#999", "#000")(props),
        color: mode("#ed8936", "#ed8936")(props),
        fontWeight: "bold",
      },
      tbody: {
        background: mode("whiteAlpha.900", "#222")(props),
      },
      th: {
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

  colors: {
    fnft: {
      light: { green: "green", orange: "orange" },
      dark: { green: "green", orange: "yellow" },
      orange: { light: "green", dark: "yellow" },
      lqblue: { light: "darkblue", dark: "aqua" },
    },
    lqblue: { light: "darkblue", dark: "aqua" },
    f_orange: "#ed8936",
    f_blue: "#4dd9f6",
  },

  semanticTokens: {
    colors: {
      fumpi: { default: "fnft.orange.light", _dark: "fnft.orange.dark" },
      lqdrblue1: { default: "lqblue.light", _dark: "lqblue.dark" },
      lqdrblue2: { default: "blue", _dark: "aqua" },
      back: { default: "#eee", _dark: "#222" },
      grad1: { default: "#EEE", _dark: "#222" },
      grad2: { default: "#DDD", _dark: "#333" },
    },
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
