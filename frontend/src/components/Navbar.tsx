const Navbar = () => {
  return (
    <div className="bg-purple-900 flex justify-between text-white h-14 items-center p-5">
      <a href="">HMS-Logo</a>
      <div className="flex gap-5">
        <a href="">Home</a>
        <a href="">Check</a>
        <a href="">Login</a>
      </div>
    </div>
  );
};

export default Navbar;
