import {
  checkIsJourneyFavorite,
  fetchUserFavoriteJourneys,
  handleUserFavoriteJourney,
} from "@/lib/api/user_favorite";
import { useAuth } from "@/lib/supabase/provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./utils/use-toast";
import errorHandler from "@/lib/error.handler";

export const useCheckIsJourneyFavorite = (journeyId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-journey-favorite", user?.id, journeyId],
    queryFn: () => checkIsJourneyFavorite(journeyId),
    enabled: !!user?.id,
  });
};

export const useFetchUserFavorite = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-favorite", user?.id],
    queryFn: () => fetchUserFavoriteJourneys(user?.id),
    enabled: !!user?.id,
  });
};

export const useHandleUserFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (journeyId: string) =>
      await handleUserFavoriteJourney(journeyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user-favorite", user?.id],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["is-journey-favorite", user?.id],
      });
      if (data) {
        toast({
          description: "Journey added to favorites",
        });
      } else {
        toast({
          description: "Journey removed from favorites",
        });
      }
    },
    onError: (error) => {
      toast({ description: errorHandler(error) });
    },
  });
};
