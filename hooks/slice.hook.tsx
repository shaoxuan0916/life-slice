import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "./utils/use-toast";
import errorHandler from "@/lib/error.handler";
import { useRouter } from "next/navigation";
import {
  createSlice,
  editSliceById,
  fetchJourneySlices,
  fetchSliceById,
} from "@/lib/api/slice";

// Public access
export const useFetchSlicesByJourneyId = (journeyId: string) => {
  return useQuery<Slice[]>({
    queryKey: ["slices", journeyId],
    queryFn: () => fetchJourneySlices(journeyId),
    enabled: !!journeyId,
  });
};

// Private access
export const useFetchSliceById = (journeyId: string, sliceId: string) => {
  return useQuery<Slice>({
    queryKey: ["slices", sliceId],
    queryFn: () => fetchSliceById(sliceId),
    enabled: !!journeyId || !!sliceId,
  });
};

export const useCreateSlice = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: Partial<Slice>) => {
      return createSlice(
        data.journey_id || "",
        data.name || "",
        data.description || "",
        data.img_urls || [],
        data.slice_date || ""
      );
    },
    async onSuccess(data) {
      toast({
        description: "New slice created!",
      });
      router.push(`/journeys/${data[0].journey_id}`);
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });
};

export const useEditSlice = (journeyId: string, sliceId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Slice>) => {
      return editSliceById(
        sliceId,
        data.name || "",
        data.description || "",
        data.img_urls || [],
        data.slice_date || ""
      );
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["slices", sliceId],
        refetchType: "active",
      });
      toast({
        description: "Slice updated!",
      });
      router.push(`/journeys/${journeyId}`);
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });
};
