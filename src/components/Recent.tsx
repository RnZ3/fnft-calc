import { Box, Button } from "@chakra-ui/react";

export function Recent(props: any) {
  //  console.log(props.list);
  return (
    <Box marginBottom="23px">
      {props.list.map((r: any, i: number) => (
        <Button key={i} style={{ margin: "3px" }} onClick={() => props.func(r)}>
          <b>{r}</b>
        </Button>
      ))}
    </Box>
  );
}
