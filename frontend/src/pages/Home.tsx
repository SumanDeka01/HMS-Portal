const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="rounded-xl bg-white p-8 text-center shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>

        <h2 className="mt-3 text-lg text-gray-600">Hostel Gate Pass System</h2>

        <button className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
