import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================

export interface IManagerMissingPet {
  mpi_id: number;
  last_seen_date: string;
  predicted_street: string;
  incident_status_id: number;
  pet_name: string;
  species_name: string;
  colour_name: string;
  owner_name: string;
  owner_phone: string;
}

export interface IManagerFoundPet {
  fpr_id: number;
  date_found: string;
  found_street: string;
  report_description: string;
  image_url: string;
  report_status_id: number;
  finder_name: string;
  finder_phone: string;
}

export interface IManagerPendingHandover {
  hoid: number;
  chosen_date: string;
  requested_at: string;
  badge_title: string;
  response_note: string;
  fpr_id: number;
  found_street: string;
  date_found: string;
  image_url: string;
  finder: {
    person_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
  pet: {
    pet_id: number;
    pet_name: string;
    pet_image: string;
    species_name: string;
    colour_name: string;
  } | null;
}

// --- PAYLOAD INTERFACES ---

export interface IApproveHandoverPayload {
  hoid: number;
  response_note: string;
  date_handed_over: string;
}

// ==========================================
// CUSTOM HOOK: useManager
// ==========================================

export const useManager = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Missing Pets (Manager's Branch)
  const managerMissingQuery = useQuery<IManagerMissingPet[]>({
    queryKey: ["manager-missing-pets"],
    queryFn: getManagerMissingPets,
  });

  // 2. Fetch Found Pets (Manager's Branch)
  const managerFoundQuery = useQuery<IManagerFoundPet[]>({
    queryKey: ["manager-found-pets"],
    queryFn: getManagerFoundPets,
  });

  // 3. Fetch Pending Handovers (Manager's Branch)
  const pendingHandoversQuery = useQuery<IManagerPendingHandover[]>({
    queryKey: ["manager-pending-handovers"],
    queryFn: getPendingHandovers,
  });

  // 4. STAGE 1: Approve Finder Intake (Drops pet off at SPCA)
  const approveHandoverMutation = useMutation({
    mutationFn: (payload: IApproveHandoverPayload) => approveHandover(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Intake approved! Pet is now at the SPCA.");
      queryClient.invalidateQueries({
        queryKey: ["manager-pending-handovers"],
      });
      queryClient.invalidateQueries({ queryKey: ["manager-found-pets"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve intake.");
    },
  });

  // 5. STAGE 2: Approve Owner Claim (Final Reunion!)
  const approveOwnerClaimMutation = useMutation({
    mutationFn: (payload: IApproveHandoverPayload) =>
      approveOwnerClaim(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Release approved! The pet is going home.");
      queryClient.invalidateQueries({
        queryKey: ["manager-pending-handovers"],
      });
      queryClient.invalidateQueries({ queryKey: ["manager-found-pets"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to approve owner claim.",
      );
    },
  });

  return {
    managerMissingQuery,
    managerFoundQuery,
    pendingHandoversQuery,
    approveHandoverMutation,
    approveOwnerClaimMutation,
  };
};

// ==========================================
// API FUNCTIONS
// ==========================================

async function getManagerMissingPets(): Promise<IManagerMissingPet[]> {
  const res = await axiosInstance.get("/manager/incidents/missing");
  return res.data;
}

async function getManagerFoundPets(): Promise<IManagerFoundPet[]> {
  const res = await axiosInstance.get("/manager/incidents/found");
  return res.data;
}

async function getPendingHandovers(): Promise<IManagerPendingHandover[]> {
  const res = await axiosInstance.get("/manager/handovers/pending");
  return res.data;
}

// STAGE 1: Finder Drop-off
async function approveHandover(payload: IApproveHandoverPayload) {
  const res = await axiosInstance.patch(
    `/manager/handovers/${payload.hoid}/approve`,
    {
      response_note: payload.response_note,
      date_handed_over: payload.date_handed_over,
    },
  );
  return res.data;
}

// STAGE 2: Owner Claim
async function approveOwnerClaim(payload: IApproveHandoverPayload) {
  const res = await axiosInstance.patch(
    `/manager/handovers/${payload.hoid}/approve-claim`,
    {
      response_note: payload.response_note,
      date_handed_over: payload.date_handed_over,
    },
  );
  return res.data;
}
