import { Link } from "react-router-dom";
import { Text } from "@chakra-ui/react";

interface ILinkProps {
  to: string;
  children: string;
}

export const NavLink = ({ to, children }: ILinkProps) => {
  return (
    <Link to={to}>
      <Text color="yello.400" fontSize="2xl" m={2}>
        {children}
      </Text>
    </Link>
  );
};
