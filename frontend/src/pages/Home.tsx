const Home = () => {
  return (
    <div className="h-screen bg-gray-600 flex justify-center items-center">
      <div className="bg-gray-400 w-screen m-4 h-150 flex justify-center items-center rounded-4xl">
        {/* <h1>Get your gatepass here</h1> */}
        <div className="bg-gray-200 w-full m-40 h-100 rounded-2xl flex justify-center items-center gap-4">
          <input className="bg-gray-50 w-50 h-10"></input>
          <input className="bg-gray-50 w-50 h-10"></input>
          <input className="bg-gray-50 w-50 h-10"></input>
          <button className="bg-blue-400">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
