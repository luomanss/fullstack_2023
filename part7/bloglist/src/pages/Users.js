import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { usersActions } from "../store";
import {
  Heading,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const Users = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(usersActions.getAll());
  }, []);

  return (
    <Stack maxW="2xl">
      <Heading>Users</Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Blogs created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </Td>
                <Td>{user.blogs.length}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
    //   <h2>Users</h2>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th></th>
    //         <th>blogs created</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {users.map((user) => (
    //         <tr key={user.id}>
    //           <td>
    //             <Link to={`/users/${user.id}`}>{user.name}</Link>
    //           </td>
    //           <td>{user.blogs.length}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default Users;
