import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";

// 1. Define specific types based on the JSON data provided
export interface Pet {
  pet_id: number;
  pet_name: string;
  pet_status: string;
  image_url: string;
  species_name: string;
}

export interface Organization {
  npo_spca_id: number;
  npo_spca_name: string;
  org_phone: string;
  org_email: string;
}

export interface UserProfile {
  person_id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  image_url: string;
  role: "pet_owner" | "community_member" | "manager" | "itadmin";
  location_id: number;
  contact_pref_id: number;
  is_onboarded: 1 | 0; // Based on your JSON sending '1'
  created_at: string;

  // Role-specific fields (Optional because they don't appear on every role)
  pets?: Pet[];
  organization?: Organization;
}

// 2. Create the custom hook
export const useProfile = (userId?: string) => {
  const profileQuery = useQuery<UserProfile>({
    // If no userId is passed, it assumes fetching the logged-in user's profile
    queryKey: ["profile", userId || "me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profiles");
      return res.data;
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    refetch: profileQuery.refetch,
  };
};
