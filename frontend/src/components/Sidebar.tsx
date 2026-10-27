import {
  PawPrint,
  Search,
  Heart,
  ArrowRightLeft,
  MessageSquare,
  Dog,
  Megaphone,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Building2,
  Users,
  LogOut,
  FileSearch,
  UserCheck,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

// 1. Define the exact role type
type Role = "community_member" | "pet_owner" | "manager" | "itadmin";

interface SidebarProps {
  role?: Role;
}

// 2. Map the links for each role based on the new workflow
const ROLE_LINKS: Record<Role, { label: string; path: string; icon: any }[]> = {
  community_member: [
    { label: "Public Feed", path: "/browse", icon: Search },
    { label: "My Found Reports", path: "/my-found-reports", icon: FileSearch },
    { label: "My Handovers", path: "/handovers", icon: ArrowRightLeft },
    { label: "Happy Tails", path: "/stories", icon: MessageSquare },
  ],
  pet_owner: [
    { label: "Public Feed", path: "/browse", icon: Search },
    { label: "My Pets", path: "/pets", icon: Dog },
    { label: "Report Lost Pet", path: "/report-lost", icon: Megaphone },
    { label: "My Claims", path: "/my-claims", icon: UserCheck },
    { label: "Happy Tails", path: "/stories", icon: MessageSquare },
  ],
  manager: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      label: "Pending Handovers",
      path: "/manager/handovers",
      icon: ArrowRightLeft,
    },
    { label: "Owner Claims", path: "/manager/claims", icon: UserCheck },
    {
      label: "Branch Incidents",
      path: "/manager/incidents",
      icon: ClipboardList,
    },
    { label: "Happy Tails", path: "/stories", icon: MessageSquare },
  ],
  itadmin: [
    { label: "Admin Panel", path: "/admin/panel", icon: ShieldCheck },
    { label: "Organizations", path: "/admin/organizations", icon: Building2 },
    { label: "Manage Staff", path: "/admin/staff", icon: Users },
  ],
};

export default function Sidebar({ role = "community_member" }: SidebarProps) {
  const { user, logout, isLoggingOut } = useAuthStore();
  const navigate = useNavigate();

  // Fallback to community_member if an invalid role is somehow passed
  const links = ROLE_LINKS[role] || ROLE_LINKS.community_member;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      // Store handles error toast
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-ink/10 bg-bone/50 backdrop-blur-md shrink-0">
      {/* ============ NAVIGATION LINKS ============ */}
      <div className="flex-1 overflow-y-auto px-4 pt-8 pb-6 space-y-1">
        <div className="px-2 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-stone capitalize">
            {role.replace("_", " ")}
          </p>
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.label}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-ink text-bone shadow-md shadow-ink/10"
                    : "text-stone hover:bg-ink/5 hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-amber" : ""
                    }`}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* ============ FOOTER (Logo & Logout) ============ */}
      <div className="p-4 border-t border-ink/10 space-y-4">
        {/* Dynamic Logo Link at the bottom */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 group px-2"
        >
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-bone group-hover:bg-burnt transition-colors">
            <PawPrint className="w-4 h-4" />
          </span>
          <span className="font-display font-black text-lg tracking-tight">
            Pet Rescue
          </span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-burnt hover:bg-burnt/10 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <span className="w-4 h-4 rounded-full border-2 border-burnt/40 border-t-burnt animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
