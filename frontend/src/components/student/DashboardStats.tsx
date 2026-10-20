import type { GatePass } from "../../types/gatepass";

const DashboardStats = ({ passes }: { passes: GatePass[] }) => {
  const stats = [
    { label: "Total applications", value: passes.length },
    {
      label: "Pending",
      value: passes.filter((p) => p.status === "Pending").length,
    },
    {
      label: "Approved",
      value: passes.filter(
        (p) => p.status === "Approved" || p.status === "Active",
      ).length,
    },
    {
      label: "Rejected",
      value: passes.filter((p) => p.status === "Rejected").length,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
