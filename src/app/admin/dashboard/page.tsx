import Link from "next/link";

type Action = {
  href: string;
  label: string;
  description: string;
  icon: string;
};

const actions: Action[] = [
  {
    href: "/admin/gigs",
    label: "Update Gig List",
    description: "Add, edit or remove upcoming shows",
    icon: "🎸",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-[oswald] uppercase tracking-widest text-white mb-2">
        What do you want to do?
      </h2>
      <p className="text-[#888] mb-10 text-sm">Select an action below.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-start gap-4 p-6 bg-[#2a2a2a] border border-[#3a3a3a] hover:border-[#710711] rounded-lg transition-colors"
          >
            <span className="text-3xl mt-0.5 select-none">{action.icon}</span>
            <div>
              <p className="font-semibold uppercase tracking-wide text-white group-hover:text-[#f1b5db] transition-colors">
                {action.label}
              </p>
              <p className="text-sm text-[#888] mt-1">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
