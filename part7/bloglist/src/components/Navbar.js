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
    <div>
      <p>{user.name}</p>
      <button onClick={handleLogout} data-cy="logout-button">
        logout
      </button>
    </div>
  ) : null;
};

const Navbar = () => {

  return (
    <nav>
      <h2>blogs</h2>
      <NavLink to="/">Blogs</NavLink>
      <NavLink to="/users">Users</NavLink>
      <User />
    </nav>
  );
};

export default Navbar;
