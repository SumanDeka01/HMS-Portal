import { useCallback, useEffect, useState } from "react";
import DashboardStats from "../components/student/DashboardStats";
import PassApplicationForm from "../components/student/PassApplicationForm";
import PassHistory from "../components/student/PassHistory";
import { createGatePass, getMyGatePasses } from "../services/gatepass.service";
import type { CreateGatePassInput, GatePass } from "../types/gatepass";

const StudentDashboard = () => {
  const [passes, setPasses] = useState<GatePass[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPasses = useCallback(async () => {
    setError("");

    try {
      const data = await getMyGatePasses();
      setPasses(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Could not load your gate passes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPasses();
  }, [loadPasses]);

  const handleSubmit = async (data: CreateGatePassInput) => {
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      await createGatePass(data);
      setShowForm(false);
      setSuccess("Application submitted successfully.");
      await loadPasses();
    } catch (err: any) {
      throw new Error(
        err?.response?.data?.message || "Unable to submit your application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">STUDENT PORTAL</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Gate-pass dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Apply for an outing and keep track of your applications.
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setSuccess("");
                setShowForm(true);
              }}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
            >
              + Apply for gate pass
            </button>
          )}
        </header>

        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>
            <button
              onClick={() => void loadPasses()}
              className="self-start font-semibold underline sm:self-auto"
            >
              Retry
            </button>
          </div>
        )}

        {showForm && (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <PassApplicationForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              submitting={submitting}
            />
          </section>
        )}

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Your application summary at a glance.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : (
            <DashboardStats passes={passes} />
          )}
        </section>

        <section>
          {loading ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-500">
              Loading your applications...
            </div>
          ) : (
            <PassHistory passes={passes} onApply={() => setShowForm(true)} />
          )}
        </section>

        <footer className="border-t border-gray-200 pt-5 text-xs text-gray-500">
          Gate-pass status is based on the latest information received from the
          server.
        </footer>
      </div>
    </main>
  );
};

export default StudentDashboard;
