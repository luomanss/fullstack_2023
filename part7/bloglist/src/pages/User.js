import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const User = () => {
  const id = useParams().id;
  const user = useSelector((state) => {
    const user = state.users.find((user) => user.id === id);

    return user ? user : null;
  });

  if (!user) {
    return <Navigate to="/404" />;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
