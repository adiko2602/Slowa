import {
  Button,
  Circle,
  Flex,
  Heading,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Header({ points }) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      p="1rem"
      mb="2rem"
      alignItems="center"
      borderBottom="1px"
      borderColor="gray.400"
      gap={3}
    >
      <Heading
        fontSize="1.5rem"
        color={colorMode === "light" ? "gray.700" : "gray.100"}
      >
        GRA W SŁOWA
      </Heading>
      <Spacer />
      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        {/* Motyw {colorMode === "light" ? "ciemny" : "jasny"} */}
      </Button>
      <Circle
        size="3.5rem"
        bg="blue.300"
        fontSize="lg"
        fontWeight="bold"
        color="white"
      >
        {points}
      </Circle>
    </Flex>
  );
}
