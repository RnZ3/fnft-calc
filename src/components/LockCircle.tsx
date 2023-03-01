import {
  Box,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

export function LockCircle(props: any): JSX.Element {
  return (
    <Box>
      <Tooltip placement="right" label="xLQDR lock ratio">
        <Box display="inline">
          {props.fnftDataFetching ? (
            <CircularProgress
              size="2.9rem"
              value={props.barRight}
              color="f_orange"
              trackColor="f_blue"
              thickness="15px"
              isIndeterminate
            />
          ) : (
            <CircularProgress
              size="2.9rem"
              value={props.barRight}
              color="f_orange"
              trackColor="f_blue"
              thickness="15px"
            >
              <CircularProgressLabel>
                {props.barRight.toFixed(0)}%
              </CircularProgressLabel>
            </CircularProgress>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}
