import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../images/HPlogo.png";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-14 items-center justify-between bg-blue-200 px-5 pr-18">
      <Link to="/home">
        <img src={logo} alt="Hostel Gate Pass Logo" className="h-55 w-auto" />
      </Link>

      <div className="flex gap-5">
        {user && <Link to="/profile">Profile</Link>}

        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
