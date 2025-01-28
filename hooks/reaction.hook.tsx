import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./utils/use-toast";
import errorHandler from "@/lib/error.handler";
import {
  fetchSliceReactions,
  handleSliceReaction,
} from "@/lib/api/slice-reaction";

export const useFetchSliceReactions = (sliceId: string) => {
  return useQuery({
    queryKey: ["slice-reactions", sliceId],
    queryFn: () => fetchSliceReactions(sliceId),
    enabled: !!sliceId,
  });
};

export const useHandleSliceReaction = (sliceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, emoji }: { type: string; emoji: string }) => {
      return handleSliceReaction(sliceId, type, emoji);
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["slice-reactions", sliceId],
        refetchType: "active",
      });
    },
    onError(error) {
      console.log("error", error);
      toast({
        title: "Error",
        description: errorHandler(error),
        variant: "destructive",
      });
    },
  });
};
