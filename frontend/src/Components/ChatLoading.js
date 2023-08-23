import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
      <Skeleton height="35px" />
    </Stack>
  );
};

export default ChatLoading;
