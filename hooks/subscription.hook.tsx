import { useQuery } from "@tanstack/react-query";
import { fetchUserSubsriptionPlan } from "@/lib/api/subscription";

export const useFetchSubscription = () => {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => fetchUserSubsriptionPlan(),
  });
};
