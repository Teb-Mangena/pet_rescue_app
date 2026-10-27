import { useAuthStore } from "../store/useAuthStore";
import Admin_Dashboard from "./admin/Admin_Dashboard";
import ManagerDashboard from "./manager/ManagerDashboard";
import Member_Dashboard from "./member/Member_Dashboard";
import PO_Dashboard from "./petOwner/PO_Dashboard";

function HomePage() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "pet_owner":
      return <PO_Dashboard />;
    case "community_member":
      return <Member_Dashboard />;
    case "manager":
      return <ManagerDashboard />;
    case "itadmin":
      return <Admin_Dashboard />;
    default:
      return (
        <div className="p-10 text-center text-stone">
          Unknown role. Please contact support.
        </div>
      );
  }
}

export default HomePage;
