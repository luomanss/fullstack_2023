import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { authActions } from "../store";

const User = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return user ? (
    <>
      <p>{user.name}</p>
      <button onClick={handleLogout} data-cy="logout-button">
        logout
      </button>
    </>
  ) : null;
};

const Navbar = () => {
  const navStyle = {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    gap: "1rem",
    backgroundColor: "#f0f0f0",
  };

  return (
    <nav style={navStyle}>
      <NavLink to="/">blogs</NavLink>
      <NavLink to="/users">users</NavLink>
      <User />
    </nav>
  );
};

export default Navbar;
