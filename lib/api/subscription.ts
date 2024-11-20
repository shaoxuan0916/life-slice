import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const fetchUserSubsriptionPlan = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};
