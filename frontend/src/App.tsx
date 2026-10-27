import { Route, Routes, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import OnboardingPage from "./pages/auth/OnboardingPage";
import PageLoader from "./components/PageLoader";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import Feeds from "./pages/shared/Feeds";
import DashboardLayout from "./components/DashboardLayout";
import MyPets from "./pages/petOwner/MyPets";
import ReportLost from "./pages/petOwner/ReportLost";
import Stories from "./pages/shared/Stories";
import Admin_Panel from "./pages/admin/Admin_Panel";
import Admin_Staff from "./pages/admin/Admin_Staff";
import MyHandovers from "./pages/member/MyHandovers";
import ReportFound from "./pages/member/ReportFound";
import ManagerHandovers from "./pages/manager/ManagerHandovers";
import BranchIncidents from "./pages/manager/BranchIncidents";
import ProfileController from "./pages/ProfileController";
import CreatePet from "./pages/petOwner/CreatePet";
import EditPet from "./pages/petOwner/EditPet";
import CreateStory from "./pages/petOwner/CreateStory";
import FoundReports from "./pages/member/FoundReports";
import MyClaims from "./pages/petOwner/MyClaims";
import Manager_OwnerClaims from "./pages/manager/Manager_OwnerClaims";
import HandoverPetToOrg from "./pages/member/HandoverPetToOrg";

function App() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  // Explicitly cast to Boolean to handle MySQL sending 1/0 instead of true/false
  const isAuthenticated = Boolean(user);
  const isOnboarded = Boolean(user?.is_onboarded);

  // Helper to redirect unauthenticated users to login, or un-onboarded to onboard
  const requireAuth = (element: React.ReactNode) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isOnboarded) return <Navigate to="/onboard" replace />;
    return element;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays at the top of every page */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* PUBLIC LANDING PAGE */}
          <Route index element={<LandingPage />} />

          {/* AUTH ROUTES */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate
                  to={isOnboarded ? "/dashboard" : "/onboard"}
                  replace
                />
              )
            }
          />

          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignupPage />
              ) : (
                <Navigate
                  to={isOnboarded ? "/dashboard" : "/onboard"}
                  replace
                />
              )
            }
          />

          {/* ONBOARDING ROUTE */}
          <Route
            path="/onboard"
            element={
              isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* =========================================
              PROTECTED DASHBOARD ROUTES 
              (Wrapped in DashboardLayout for Sidebar)
              ========================================= */}
          <Route element={requireAuth(<DashboardLayout />)}>
            {/* Main Dashboard Hub (Renders based on role) */}
            <Route path="/dashboard" element={<HomePage />} />

            {/* Public Feed */}
            <Route path="/browse" element={<Feeds />} />

            {/* Add other Sidebar pages here as you build them: */}
            {/* FOR PET OWNER */}
            <Route path="/pets" element={<MyPets />} />
            <Route path="/pets/add" element={<CreatePet />} />
            <Route path="/pets/edit/:id" element={<EditPet />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/new" element={<CreateStory />} />
            <Route path="/my-claims" element={<MyClaims />} />

            {/* FOR ADMIN */}
            <Route path="/admin/panel" element={<Admin_Panel />} />
            <Route path="/admin/staff" element={<Admin_Staff />} />

            {/* FOR MEMBER */}
            <Route path="/handovers" element={<MyHandovers />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/my-found-reports" element={<FoundReports />} />
            <Route
              path="/handovers/request/:id"
              element={<HandoverPetToOrg />}
            />

            {/* FOR MANAGER */}
            <Route path="/manager/handovers" element={<ManagerHandovers />} />
            <Route path="/manager/incidents" element={<BranchIncidents />} />
            <Route path="/manager/claims" element={<Manager_OwnerClaims />} />

            {/* COMMON */}
            <Route path="/profile" element={<ProfileController />} />
          </Route>

          {/* FALLBACK ROUTE */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
