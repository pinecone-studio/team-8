import {
  Heart,
  Lock,
  ScrollText,
  Users,
} from "lucide-react";

const stats = [
  { label: "Total Employees", value: "4", icon: Users, iconColor: "text-slate-400" },
  { label: "Active Benefits", value: "4", icon: Heart, iconColor: "text-emerald-500" },
  { label: "Pending Requests", value: "1", icon: ScrollText, iconColor: "text-orange-500" },
  { label: "Locked Benefits", value: "2", icon: Lock, iconColor: "text-slate-400" },
];

const categoryBars = [
  { label: "Wellness", value: 3 },
  { label: "Equipment", value: 1 },
  { label: "Financial", value: 1 },
  { label: "Career Dev", value: 1 },
  { label: "Flexibility", value: 2 },
];

const pieSegments = [
  { value: 50, color: "#3b82f6" },
  { value: 25, color: "#f97316" },
  { value: 25, color: "#10b981" },
];

const quickLinks = [
  {
    title: "Employee Eligibility Inspector",
    description: "View and override employee benefit eligibility",
  },
  {
    title: "Rule Configuration",
    description: "Manage benefit eligibility rules",
  },
  {
    title: "Vendor Contracts",
    description: "Manage benefit vendor contracts",
  },
];

function BarChart() {
  const max = Math.max(...categoryBars.map((item) => item.value));

  return (
    <div className="flex h-[230px] items-end gap-4 border-l border-b border-dashed border-slate-200 px-3 pb-0 pt-3">
      {categoryBars.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-[180px] w-full items-end">
            <div
              className="w-full rounded-t-md bg-blue-500"
              style={{ height: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function PieChart() {
  const gradientStops = pieSegments.reduce<string[]>(
    (acc, segment, index) => {
      const start = pieSegments
        .slice(0, index)
        .reduce((sum, item) => sum + item.value, 0);
      const end = start + segment.value;

      acc.push(`${segment.color} ${start}%`, `${segment.color} ${end}%`);
      return acc;
    },
    [],
  );

  return (
    <div className="flex h-[230px] items-center justify-center">
      <div
        className="h-36 w-36 rounded-full"
        style={{
          background: `conic-gradient(${gradientStops.join(", ")})`,
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: string;
  icon: typeof Users;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <p className="text-4xl font-semibold tracking-[-0.02em] text-slate-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <main className="flex-1 px-8 py-9">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-[2.25rem] font-semibold tracking-[-0.02em] text-slate-900">
            HR Admin Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Overview of benefits management system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Benefit Usage by Category
            </h2>
            <div className="mt-4">
              <BarChart />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Eligibility Lock Reasons
            </h2>
            <div className="mt-4">
              <PieChart />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {quickLinks.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
