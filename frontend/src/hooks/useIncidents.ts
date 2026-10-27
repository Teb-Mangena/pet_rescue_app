import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================

export interface IMissingPet {
  mpi_id: number;
  last_seen_date: string;
  predicted_street: string;
  reward_offered: string;
  incident_description: string;
  pet_name: string;
  pet_image: string;
  species_name: string;
  colour_name: string;
  urgency_name: string;
}

export interface IFoundPet {
  report_info: {
    fpr_id: number;
    date_found: string;
    found_street: string;
    reported_at: string;
    description: string;
    report_image: string;
    finder_name: string;
    finder_id: number | string;
  };
  tracking_status: {
    status_id: number;
    status_text: string;
    handover_active: boolean;
    handover_badge: string | null;
    handover_date: string | null;
    completed_on: string | null;
  };
  spca_details: {
    id: number;
    name: string;
    location: string;
    phone: string;
    email: string;
  } | null;
  pet_info: {
    pet_id: number;
    name: string;
    status: string;
    description: string;
    image: string;
    species: string;
    colour: string;
    size: string;
  } | null;
}

export interface IMyHandover {
  hoid: number;
  chosen_date: string;
  requested_at: string;
  badge_title: string;
  response_note: string;
  fpr_id: number;
  found_street: string;
  date_found: string;
  report_image: string;
  spca: {
    npo_spca_id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
  pet: {
    pet_id: number;
    pet_name: string;
    pet_status: string;
    pet_image: string;
    species_name: string;
    colour_name: string;
  } | null;
}

// --- PAYLOAD INTERFACES ---

export interface IReportMissingPetPayload {
  pet_id: number;
  missing_reason_id: number;
  last_seen_date: string;
  org_neighbourhood_id: number;
  predicted_street: string;
  urgency_level_id: number;
  reward_offered?: string;
  incident_description: string;
  recent_wellbeing_id?: number;
  other_desc?: string;
}

export interface IReportFoundPetPayload {
  mpi_id: number | null;
  found_date: string;
  found_street: string;
  org_neighbourhood_id: number;
  found_description: string;
  other_desc?: string;
  current_wellbeing_id?: number;
}

export interface ILogFinderHandoverPayload {
  chosen_date: string;
  response_note: string;
  npo_spca_id: string | number;
}

export interface ISchedulePickUpPayload {
  chosen_date: string;
  response_note: string;
}

// ==========================================
// CUSTOM HOOK: useIncidents
// ==========================================

export const useIncidents = () => {
  const queryClient = useQueryClient();

  // 1. FETCH ALL MISSING PETS (Community Feed)
  const missingPetsQuery = useQuery<IMissingPet[]>({
    queryKey: ["missing-pets"],
    queryFn: getAllMissingPets,
  });

  // 2. FETCH ALL FOUND PETS
  const foundPetsQuery = useQuery<IFoundPet[]>({
    queryKey: ["found-pets"],
    queryFn: getAllFoundPets,
  });

  // 2b. FETCH LOGGED-IN USER's HANDOVERS (Drop-offs)
  const myHandoversQuery = useQuery<IMyHandover[]>({
    queryKey: ["my-handovers"],
    queryFn: getMyHandovers,
  });

  // 3. REPORT A MISSING PET
  const reportMissingMutation = useMutation({
    mutationFn: (data: IReportMissingPetPayload) => reportMissingPet(data),
    onSuccess: () => {
      toast.success("Missing pet reported successfully.");
      queryClient.invalidateQueries({ queryKey: ["missing-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to report missing pet.",
      );
    },
  });

  // 4. REPORT A FOUND PET (Standard JSON)
  const reportFoundMutation = useMutation({
    mutationFn: reportFoundPet,
    onSuccess: () => {
      toast.success("Found pet reported successfully!");
      queryClient.invalidateQueries({ queryKey: ["found-pets"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to report found pet.",
      );
    },
  });

  // 5. RESOLVE A MISSING INCIDENT (Pet Found)
  const resolveMissingMutation = useMutation({
    mutationFn: resolveMissingIncident,
    onSuccess: () => {
      toast.success("Incident resolved. Welcome home, pet!");
      queryClient.invalidateQueries({ queryKey: ["missing-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to resolve incident.",
      );
    },
  });

  // 6. LOG FINDER HANDOVER (Finder dropping pet off)
  const logFinderHandoverMutation = useMutation({
    mutationFn: (params: { fpr_id: number; data: ILogFinderHandoverPayload }) =>
      logFinderHandover(params),
    onSuccess: () => {
      toast.success("Hand-over logged successfully! Thank you.");
      queryClient.invalidateQueries({ queryKey: ["found-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-handovers"] }); // Refresh finder's list
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to log handover.");
    },
  });

  // 7. OWNER CLAIMS PET (Schedules pick-up)
  const claimMyPetMutation = useMutation({
    mutationFn: (params: { hoid: number; data: ISchedulePickUpPayload }) =>
      claimMyPet(params),
    onSuccess: (data) => {
      toast.success(data.message || "Pick-up scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["found-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to schedule pet claim.",
      );
    },
  });

  return {
    missingPetsQuery,
    foundPetsQuery,
    myHandoversQuery,
    reportMissingMutation,
    reportFoundMutation,
    resolveMissingMutation,
    logFinderHandoverMutation,
    claimMyPetMutation,
  };
};

// ==========================================
// API FUNCTIONS
// ==========================================

async function getAllMissingPets() {
  const res = await axiosInstance.get("/incidents/missing");
  return res.data;
}

async function getAllFoundPets() {
  const res = await axiosInstance.get("/incidents/found");
  return res.data;
}

async function getMyHandovers() {
  // Matched to the backend router fix!
  const res = await axiosInstance.get("/incidents/handovers/my");
  return res.data;
}

async function reportMissingPet(data: IReportMissingPetPayload) {
  const res = await axiosInstance.post("/incidents/missing", data);
  return res.data;
}

async function reportFoundPet(data: IReportFoundPetPayload) {
  const res = await axiosInstance.post("/incidents/found", data);
  return res.data;
}

async function resolveMissingIncident(mpi_id: number) {
  const res = await axiosInstance.patch(`/incidents/missing/${mpi_id}/resolve`);
  return res.data;
}

async function logFinderHandover({
  fpr_id,
  data,
}: {
  fpr_id: number;
  data: ILogFinderHandoverPayload;
}) {
  const res = await axiosInstance.post(
    `/incidents/found/${fpr_id}/finder-handover`,
    data,
  );
  return res.data;
}

async function claimMyPet({
  hoid,
  data,
}: {
  hoid: number;
  data: ISchedulePickUpPayload;
}) {
  const res = await axiosInstance.patch(
    `/incidents/handover/${hoid}/claim`,
    data,
  );
  return res.data;
}
