import { Alert, AlertIcon, Box } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => {
    return state.notification;
  });

  if (!notification) {
    return null;
  }

  const { type, content } = notification;

  // return <div className={`notification ${type}`}>{content}</div>;
  return (
    <Box
      pos="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      w="md"
      h="xs"
    >
      <Alert status={type}>
        <AlertIcon />
        {content}
      </Alert>
    </Box>
  );
};

export default Notification;
