import { useAuth } from "@/lib/supabase/provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./utils/use-toast";
import errorHandler from "@/lib/error.handler";
import { useRouter } from "next/navigation";
import {
  createJourney,
  editJourneyById,
  fetchJourneyById,
  fetchPublicJourneys,
  fetchUserJourneys,
} from "@/lib/api/journey";

// Public access
export const useFetchPublicJourneys = (
  searchQuery: string,
  page: number,
  limit: number
) => {
  return useQuery<(Journey & { users: UserInfo })[]>({
    queryKey: ["explore", "journeys", searchQuery, page],
    queryFn: () =>
      fetchPublicJourneys(searchQuery, page * limit, (page + 1) * limit - 1),
  });
};

export const useFetchJourneyById = (journeyId: string) => {
  return useQuery<Journey>({
    queryKey: ["journeys", journeyId],
    queryFn: () => fetchJourneyById(journeyId),
    enabled: !!journeyId,
  });
};

// Private access
export const useFetchUserJourneys = () => {
  const { user } = useAuth();
  return useQuery<(Journey & { users: UserInfo })[]>({
    queryKey: ["journeys", user?.id || ""],
    queryFn: () => fetchUserJourneys(user?.id || ""),
  });
};

export const useCreateJourney = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: Partial<Journey>) => {
      return createJourney(
        data.name || "",
        data.description || "",
        data.cover_img_url || "",
        data.is_public || false
      );
    },
    async onSuccess(data) {
      toast({
        description: "New journey created!",
      });
      router.push(`/journeys/${data[0].id}`);
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });
};

export const useEditJourneyById = (journeyId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Journey>) => {
      return editJourneyById(
        journeyId,
        data.name || "",
        data.description || "",
        data.cover_img_url || "",
        data.is_public || false
      );
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["journeys", journeyId],
        refetchType: "active",
      });
      toast({
        description: "Journey updated!",
      });
      router.push(`/journeys/${journeyId}`);
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });
};
