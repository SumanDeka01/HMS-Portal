import type { GatePassStatus } from "../../types/gatepass";

const styles: Record<GatePassStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  Active: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Returned: "bg-gray-100 text-gray-700 ring-gray-500/20",
  Expired: "bg-orange-50 text-orange-700 ring-orange-600/20",
};

const PassStatusBadge = ({ status }: { status: GatePassStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
  >
    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default PassStatusBadge;
