import { useAuthStore } from "../store/useAuthStore";
import Admin_Profile from "./admin/Admin_Profile";
import Manager_Profile from "./manager/Manager_Profile";
import Member_Profile from "./member/Member_Profile";
import PO_Profile from "./petOwner/PO_Profile";

function ProfileController() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "pet_owner":
      return <PO_Profile />;
    case "community_member":
      return <Member_Profile />;
    case "manager":
      return <Manager_Profile />;
    case "itadmin":
      return <Admin_Profile />;
    default:
      return (
        <div className="p-10 text-center text-stone">
          Unknown role. Please contact support.
        </div>
      );
  }
}

export default ProfileController;
