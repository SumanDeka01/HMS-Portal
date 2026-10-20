import type { GatePass } from "../../types/gatepass";
import PassStatusBadge from "./PassStatusBadge";

interface Props {
  passes: GatePass[];
  onApply: () => void;
}

const formatDate = (value?: string) => {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const PassHistory = ({ passes, onApply }: Props) => {
  if (passes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
          ↗
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900">
          No gate-pass applications yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Your applications and their approval status will appear here.
        </p>
        <button
          onClick={onApply}
          className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Apply for a gate pass
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Recent applications</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your applications and decisions.
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {passes.map((pass) => (
          <article key={pass._id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">
                  {pass.destination}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{pass.reason}</p>
              </div>
              <PassStatusBadge status={pass.status} />
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-gray-500">Departure</p>
                <p className="mt-1 font-medium text-gray-800">
                  {formatDate(pass.outDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Expected return</p>
                <p className="mt-1 font-medium text-gray-800">
                  {formatDate(pass.expectedReturn)}
                </p>
              </div>
            </div>

            {pass.status === "Rejected" && pass.rejectionReason && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                <span className="font-semibold">Reason for rejection: </span>
                {pass.rejectionReason}
              </div>
            )}

            {pass.status === "Approved" && pass.qrToken && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                Your pass is approved. QR verification will use this pass token.
                <p className="mt-1 break-all font-mono text-xs">
                  {pass.qrToken}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};

export default PassHistory;
