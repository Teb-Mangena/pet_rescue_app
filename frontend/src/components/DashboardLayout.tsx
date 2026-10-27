import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../store/useAuthStore";

export default function DashboardLayout() {
  const { user } = useAuthStore();

  // Map role for sidebar
  const sidebarRole =
    user?.role === "itadmin"
      ? "itadmin"
      : (user?.role as
          | "community_member"
          | "pet_owner"
          | "manager"
          | "itadmin") || "community_member";

  return (
    <div className="flex h-screen bg-bone overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar role={sidebarRole} />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto h-full relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* THIS is where the child pages will appear */}
        <div className="relative min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
