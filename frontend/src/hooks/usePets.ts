import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../config/axios";

// --- Types ---
export interface IPet {
  pet_id: number;
  pet_name: string;
  ownership: string;
  pet_description: string;
  registered_at: string;
  pet_status: string;
  image_url: string;
  species_name: string;
  colour_name: string;
  size_name: string;
}

export const usePets = (userId?: string) => {
  const queryClient = useQueryClient();

  // 1. FETCH MY PETS
  const myPetsQuery = useQuery<IPet[]>({
    queryKey: ["my-pets", userId || "me"],
    queryFn: getMyPets,
  });

  // 2. ADD PET MUTATION
  const addPetMutation = useMutation({
    mutationFn: addPet,
    onSuccess: () => {
      toast.success("Pet added successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add pet");
    },
  });

  // 3. UPDATE PET MUTATION
  const updatePetMutation = useMutation({
    mutationFn: updatePet,
    onSuccess: () => {
      toast.success("Pet updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update pet");
    },
  });

  // 4. DELETE PET MUTATION
  const deletePetMutation = useMutation({
    mutationFn: deletePet,
    onSuccess: () => {
      toast.success("Pet deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        toast.error(
          "Cannot delete pet: It is linked to an active incident report.",
        );
      } else {
        toast.error(error.response?.data?.message || "Failed to delete pet");
      }
    },
  });

  return {
    myPetsQuery,
    addPetMutation,
    updatePetMutation,
    deletePetMutation,
  };
};

async function getMyPets() {
  const res = await axiosInstance.get("/pets/my");
  return res.data;
}

async function addPet(newPetData: FormData) {
  const res = await axiosInstance.post("/pets/add", newPetData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

async function updatePet({ id, data }: { id: number; data: FormData }) {
  const res = await axiosInstance.patch(`/pets/edit/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

async function deletePet(petId: number) {
  const res = await axiosInstance.delete(`/pets/remove/${petId}`);
  return res.data;
}
