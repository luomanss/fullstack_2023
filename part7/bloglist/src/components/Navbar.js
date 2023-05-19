import { useDispatch, useSelector } from "react-redux";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { authActions } from "../store";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

// const User = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     dispatch(authActions.logout());
//     navigate("/login");
//   };

//   return user ? (
//     <>
//       <p>{user.name}</p>
//       <button onClick={handleLogout} data-cy="logout-button">
//         logout
//       </button>
//     </>
//   ) : null;
// };

const UserMenu = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
          data-cy="user-menu-button"
        >
          <Avatar size={"sm"} name="Kalervo Jankko" />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleLogout} color="black" data-cy="logout-button">
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const NavLink = ({ name, route }) => {
  const isLogged = useSelector((state) => state.user !== null);
  const linkProps = isLogged ? {
    pointerEvents: "auto",
  } : {
    pointerEvents: "none",
    color: "gray.400",
  };

  return (
    <Link
      as={RouterNavLink}
      px={2}
      py={1}
      rounded={"md"}
      colorScheme="teal"
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("teal.500", "gray.700"),
      }}
      to={route}
      _activeLink={{ fontWeight: "bold" }}
      data-cy={`nav-link-${name.toLowerCase()}`}
      {...linkProps}
    >
      {name}
    </Link>
  );
};

const Links = [
  { name: "Blogs", route: "/" },
  { name: "Users", route: "/users" },
];

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue("teal", "gray.900")} px={4} textColor={"white"}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size={"md"}
          colorScheme="teal"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box>BlogsApp</Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </HStack>
        </HStack>
        {/* <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              minW={0}
            >
              <Avatar size={"sm"} name="Kalervo Jankko" />
            </MenuButton>
            <MenuList>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex> */}
        <UserMenu />
        {/*  */}
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link} {...link} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
};

export default Navbar;

// <nav style={navStyle}>
//   <NavLink to="/">blogs</NavLink>
//   <NavLink to="/users">users</NavLink>
//   <User />
// </nav>
