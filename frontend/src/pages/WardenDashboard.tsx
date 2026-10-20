import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

interface Student {
  username?: string;
  email?: string;
  enrollmentNumber?: string;
  course?: string;
  hostel?: string;
  roomNo?: string;
  phoneNumber?: string;
}

interface GatePass {
  _id: string;
  studentId: Student | string;
  reason: string;
  destination: string;
  outDate: string;
  expectedReturn: string;
  emergencyContact?: string;
  emergencyContanct?: string;
  status: string;
  createdAt: string;
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function WardenDashboard() {
  const [passes, setPasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPendingPasses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/gatepass/pending");
      setPasses(response.data.gatePasses ?? []);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Could not load pending requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPendingPasses();
  }, [loadPendingPasses]);

  const approvePass = async (id: string) => {
    setProcessingId(id);
    setError("");
    setMessage("");

    try {
      await api.patch(`/gatepass/${id}/approve`);
      setMessage("Request approved. QR token generated.");
      await loadPendingPasses();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Could not approve this request.",
      );
    } finally {
      setProcessingId("");
    }
  };

  const rejectPass = async (id: string) => {
    const rejectionReason = window.prompt(
      "Enter the reason for rejecting this request:",
    );

    if (rejectionReason === null) return;

    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }

    setProcessingId(id);
    setError("");
    setMessage("");

    try {
      await api.patch(`/gatepass/${id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      setMessage("Request rejected.");
      await loadPendingPasses();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not reject this request.");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Hostel Administration
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Warden Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Review and manage student gate-pass requests.
            </p>
          </div>

          <button
            onClick={() => void loadPendingPasses()}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh requests"}
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending approval</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {passes.length}
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading requests...
          </div>
        ) : passes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              All caught up!
            </h2>
            <p className="mt-2 text-slate-500">
              There are no pending gate-pass requests.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {passes.map((pass) => {
              const student =
                typeof pass.studentId === "object" ? pass.studentId : null;

              return (
                <article
                  key={pass._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {student?.username || "Student"}
                      </h2>
                      <p className="mt-1 break-all text-sm text-slate-500">
                        {student?.enrollmentNumber || "Enrollment unavailable"}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Pending
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Email / Contact</p>
                      <p className="mt-1 break-words font-medium text-slate-800">
                        {student?.email || "—"}
                        {student?.phoneNumber
                          ? ` · ${student.phoneNumber}`
                          : ""}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-slate-500">Course</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {student?.course || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Hostel / Room</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {student?.hostel || "—"}
                          {student?.roomNo ? ` / ${student.roomNo}` : ""}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-500">Reason</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {pass.reason}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Destination</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {pass.destination}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-slate-500">Outing time</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {formatDate(pass.outDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Expected return</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {formatDate(pass.expectedReturn)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-500">Emergency contact</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {pass.emergencyContact || pass.emergencyContanct || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                    <button
                      onClick={() => void approvePass(pass._id)}
                      disabled={processingId !== ""}
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingId === pass._id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      onClick={() => void rejectPass(pass._id)}
                      disabled={processingId !== ""}
                      className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
