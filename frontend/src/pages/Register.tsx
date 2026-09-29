import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface RegisterForm {
  username: string;
  email: string;
  enrollmentNumber: string;
  course: string;
  hostel: string;
  roomNo: string;
  phoneNumber: string;
  password: string;
  role: "student";
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    enrollmentNumber: "",
    course: "B.Tech CSE",
    hostel: "",
    roomNo: "",
    phoneNumber: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/register", formData);

      setMessage(res.data.message || "Registration successful!");

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Hostel Gate Pass System
        </p>

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="College Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="enrollmentNumber"
            placeholder="Enrollment Number"
            value={formData.enrollmentNumber}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="B.Tech CSE">B.Tech CSE</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>

          <select
            name="hostel"
            value={formData.hostel}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Hostel</option>
            <option value="Boys Hostel A">Boys Hostel A</option>
            <option value="Boys Hostel B">Boys Hostel B</option>
            <option value="Girls Hostel A">Girls Hostel A</option>
            <option value="Girls Hostel B">Girls Hostel B</option>
          </select>

          <input
            type="text"
            name="roomNo"
            placeholder="Room Number"
            value={formData.roomNo}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
