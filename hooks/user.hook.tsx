import { editUser, fetchUser } from "@/lib/api/user";
import { useAuth } from "@/lib/supabase/provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "./utils/use-toast";
import errorHandler from "@/lib/error.handler";

export const useFetchUser = () => {
  const { user } = useAuth();
  return useQuery<UserInfo[]>({
    queryKey: ["user"],
    queryFn: () => fetchUser(user?.id || ""),
  });
};

export const useEditUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserInfo>) => {
      return editUser(data.full_name || "", data.username || "");
    },
    async onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "active",
      });
      toast({
        description: "User updated!",
      });
      router.push("/profile");
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });
};
