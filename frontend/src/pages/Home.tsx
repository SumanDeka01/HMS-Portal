import { useState } from "react";

const Home = () => {
  const [name, setName] = useState<string>("");
  const [rollNo, setRollNo] = useState<string>("");
  const [hostel, setHostel] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const gatePassData = {
      name,
      rollNo,
      hostel,
      reason,
    };

    console.log(gatePassData);
  };

  return (
    <div className="min-h-screen bg-gray-600 flex justify-center items-center p-5">
      <div className="bg-gray-400 w-full max-w-3xl rounded-4xl p-10">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-200 rounded-2xl p-10 flex flex-col gap-5"
        >
          <h1 className="text-2xl  text-center bg-gray-800 text-white rounded-2xl h-10">
            Get Your Gate Pass
          </h1>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="bg-gray-50 h-10 px-3 rounded"
          />

          <input
            type="text"
            placeholder="Enter your roll number"
            value={rollNo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRollNo(e.target.value)
            }
            className="bg-gray-50 h-10 px-3 rounded"
          />

          <select
            value={hostel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setHostel(e.target.value)
            }
            className="bg-gray-50 h-10 px-3 rounded"
          >
            <option value="" disabled>
              Select your hostel
            </option>

            <option value="H Hostel">H Hostel</option>
            <option value="HE Hostel">HE Hostel</option>
            <option value="I Hostel">I Hostel</option>
          </select>

          <textarea
            placeholder="Enter the reason here"
            value={reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setReason(e.target.value)
            }
            className="bg-gray-50 h-24 px-3 py-2 rounded resize-none"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white h-10 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
