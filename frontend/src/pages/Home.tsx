// const Home = () => {
//   const hostels = ["H-Hostel", "I-Hostel", "HE-Hostel"];

//   return (
//     <div className="h-screen bg-gray-600 flex justify-center items-center">
//       <div className="bg-gray-400 w-screen m-40 h-150 flex justify-center items-center rounded-4xl">
//         {/* <h1>Get your gatepass here</h1> */}
//         <div className="bg-gray-200 w-full m-20 h-100 rounded-2xl flex justify-center items-center gap-4">
//           <input className="bg-gray-50 w-50 h-10"></input>
//           <input className="bg-gray-50 w-50 h-10"></input>
//           <input
//             placeholder="Enter the reason here"
//             className="bg-gray-50 w-50 h-10"
//           ></input>

//           {/* <button className="bg-blue-400">Submit</button> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

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
          <h1 className="text-2xl font-bold text-center">Get Your Gate Pass</h1>

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
