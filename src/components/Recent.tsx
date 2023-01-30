import { Box, Button } from "@chakra-ui/react";

export function Recent(props: any) {
  //  console.log(props.list);
  return (
    <Box margin="0">
      {props.list.map((r: any, i: number) => (
        <Button key={i} style={{ marginRight: "7px" }} onClick={() => props.func(r)}>
          <b>{r}</b>
        </Button>
      ))}
    </Box>
  );
}
