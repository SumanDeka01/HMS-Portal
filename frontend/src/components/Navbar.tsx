const Navbar = () => {
  return (
    <div className="bg-black flex justify-between text-white h-14 items-center p-5">
      <a href="">HMS-Logo</a>
      <div className="flex gap-5">
        <a href="">Profile</a>
        <a href="">Login</a>
      </div>
    </div>
  );
};

export default Navbar;
