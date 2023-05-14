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
        >
          <Avatar size={"sm"} name="Kalervo Jankko" />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

const NavLink = ({ children }) => (
  <Link
    as={RouterNavLink}
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    to={`/${children.toLowerCase()}`}
    _activeLink={{ fontWeight: "bold" }}
    style={{ pointerEvents: "none" }}
  >
    {children}
  </Link>
);

const Links = ["Blogs", "Users"];

const Navbar = () => {
  // const navStyle = {
  //   display: "flex",
  //   justifyContent: "start",
  //   alignItems: "center",
  //   gap: "1rem",
  //   backgroundColor: "#f0f0f0",
  // };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <Box>BlogsApp</Box>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
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
              <NavLink key={link}>{link}</NavLink>
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
