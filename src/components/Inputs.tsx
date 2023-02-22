import { useEffect, useState } from "react";
import { HStack, Button, Input, Box } from "@chakra-ui/react";
import { useLastFnftId } from "hooks/useMyQueries";
import { useGlobalContext } from "context/context";
import { Recent } from "components/Recent";

export function Inputs(): JSX.Element {
  const [id, setId] = useState("");
  const { fnftId, setFnftId, idHistory } = useGlobalContext();
  const regex_digit = /^\d*$/;
  const queryParams = new URLSearchParams(window.location.search);
  const qid = queryParams.get("id");
  const { data: lastFnftId } = useLastFnftId();

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFnftId(id);
  };

  useEffect(() => {
    setId(fnftId);
  }, [fnftId]);

  useEffect(() => {
    if (lastFnftId) {
      if (
        qid !== null &&
        regex_digit.test(qid) &&
        parseInt(qid) <= lastFnftId
      ) {
        setFnftId(qid);
      }
    }
    // eslint-disable-next-line
  }, [qid, lastFnftId]);

  return (
    <>
      <HStack margin="23px">
        <Box>
          <Recent
            list={idHistory ? JSON.parse(idHistory) : []}
            func={setFnftId}
          />
        </Box>
        <Box sx={{}} textAlign="center">
          <form onSubmit={submitForm}>
            <Input
              m={"2px 7px 2px 2px"}
              value={id}
              onChange={(e) => setId(e.target.value)}
              type="number"
              max={lastFnftId}
              min="1"
              step="1"
              placeholder="fNFT ID"
            />{" "}
            <Button m={"2px 7px 2px 2px"} type="submit">
              submit
            </Button>
          </form>
        </Box>
      </HStack>
    </>
  );
}
