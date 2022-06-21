// navbar react component using chakraUI

import { Box, Stack, Text } from "@chakra-ui/react";
import { FaBeer } from "react-icons/fa";
import { NavLink } from "./NavLink";

export const NavbarC = () => {
  return (
    <Stack
      justifyContent="space-around"
      alignItems="center"
      direction="row"
      backgroundColor="brownish.400"
      p={6}
    >
      <Text color="yellow.400" fontSize="3xl" fontWeight="bold" opacity={1}>
        Bjre 🍺
      </Text>
      <Stack direction="row" color="yello.400">
        <NavLink to="realtime">RealTime</NavLink>
        <NavLink to="list">Zgodovina</NavLink>
        <NavLink to="add">Nova Bjra</NavLink>
      </Stack>
    </Stack>
  );
};
