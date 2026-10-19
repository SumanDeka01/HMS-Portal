import { useState } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  User,
  CalendarDays,
  LogOut,
  LoaderCircle,
  GraduationCap,
  Phone,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

interface Student {
  username: string;
  email: string;
  enrollmentNumber: string;
  course?: string;
  hostel?: string;
  roomNo?: string;
  phoneNumber?: string;
}

interface GatePass {
  _id: string;
  studentId: Student;
  reason: string;
  destination: string;
  outDate: string;
  expectedReturn: string;
  status: string;
  qrToken?: string;
}

interface VerificationResponse {
  valid: boolean;
  message: string;
  gatePass?: GatePass;
}

export default function SecurityDashboard() {
  const { logout } = useAuth();

  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState("");

  const verifyPass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!qrToken.trim()) {
      setError("Please enter the gate-pass QR token.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post<VerificationResponse>(
        "/gatepass/verify",
        { qrToken: qrToken.trim() },
      );

      setResult(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to verify the gate pass. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const clearVerification = () => {
    setQrToken("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
              <ShieldCheck size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Security Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                Hostel Gate Pass Verification
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
            Security Control
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Verify a Gate Pass
          </h2>
          <p className="mt-2 text-slate-600">
            Enter the token from the student's approved gate-pass QR code.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
                <Search size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Pass Verification
                </h3>
                <p className="text-sm text-slate-500">
                  Manual token verification
                </p>
              </div>
            </div>

            <form onSubmit={verifyPass} className="space-y-4">
              <label
                htmlFor="qrToken"
                className="block text-sm font-medium text-slate-700"
              >
                QR Token
              </label>

              <input
                id="qrToken"
                type="text"
                value={qrToken}
                onChange={(event) => setQrToken(event.target.value)}
                placeholder="e.g. GP-xxxxxxxx-xxxx-xxxx..."
                autoComplete="off"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={19} />
                    Verify Gate Pass
                  </>
                )}
              </button>
            </form>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
              >
                <XCircle size={21} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Verification failed</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div
                role="status"
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                  result.valid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {result.valid ? (
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
                ) : (
                  <XCircle size={22} className="mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="font-semibold">
                    {result.valid ? "Pass is valid" : "Pass is invalid"}
                  </p>
                  <p className="mt-1 text-sm">{result.message}</p>
                </div>
              </div>
            )}

            {(result || error) && (
              <button
                type="button"
                onClick={clearVerification}
                className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Verify Another Pass
              </button>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Security Checklist
                </h3>
                <p className="text-sm text-slate-500">
                  Before allowing a student to leave
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                "Verify the pass using the system.",
                "Confirm the student's identity.",
                "Check the destination and outing time.",
                "Check the expected return time.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-slate-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Important</p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Do not allow exit based only on a screenshot of a QR code.
                Confirm the result returned by the verification system.
              </p>
            </div>
          </section>
        </div>

        {result?.valid && result.gatePass && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 bg-emerald-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-700" size={24} />
                <div>
                  <h3 className="font-bold text-emerald-900">
                    Verified Gate Pass
                  </h3>
                  <p className="text-sm text-emerald-800">
                    The backend confirmed this pass is currently valid.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                APPROVED
              </span>
            </div>

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="mb-3 flex items-center gap-2 text-slate-500">
                  <User size={18} />
                  <span className="text-sm font-medium">Student Details</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">
                  {result.gatePass.studentId?.username || "Student"}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  Enrollment No:{" "}
                  {result.gatePass.studentId?.enrollmentNumber || "N/A"}
                </p>
              </div>

              <div className="flex gap-3">
                <GraduationCap className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Course</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {result.gatePass.studentId?.course || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {result.gatePass.studentId?.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Destination</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {result.gatePass.destination}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CalendarDays className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Outing Time</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(result.gatePass.outDate)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Expected Return</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(result.gatePass.expectedReturn)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="mt-1 text-indigo-600" size={20} />
                <div>
                  <p className="text-sm text-slate-500">Hostel / Room</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {result.gatePass.studentId?.hostel || "N/A"} /{" "}
                    {result.gatePass.studentId?.roomNo || "N/A"}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">Reason for outing</p>
                <p className="mt-1 text-slate-800">{result.gatePass.reason}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
