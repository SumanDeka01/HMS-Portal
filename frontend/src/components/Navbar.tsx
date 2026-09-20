import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-black flex justify-between text-white h-14 items-center p-5">
      <a href="">HMS-Logo</a>
      <div className="flex gap-5">
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
