import {
  Box,
  Text
} from "@chakra-ui/react";

export function MsgBox(props: any) {
  return (
    <Box>
      <Text fontSize="1.2rem" fontWeight="bold" color="red" align="center">
        {props.text}
      </Text>
    </Box>
  );
}
