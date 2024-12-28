import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const checkIsJourneyFavorite = async (journeyId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data: favorite, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("journey_id", journeyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return !!favorite;
};

export const fetchUserFavoriteJourneys = async (userId?: string) => {
  if (!userId) throw new Error("No logged in user.");
  const { data: favorites, error } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(errorHandler(error));
  }

  const { data: journeys, error: fetchJourneysError } = await supabase
    .from("journeys")
    .select("*")
    .in(
      "id",
      favorites?.map((f) => f.journey_id)
    )
    .order("updated_at", { ascending: false });

  if (fetchJourneysError) {
    throw new Error(errorHandler(fetchJourneysError));
  }

  return journeys;
};

// Add or remove user favorite journey
export const handleUserFavoriteJourney = async (journeyId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  // Check if favorite already exists
  const { data: favorite, error: fetchError } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("journey_id", journeyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 means no rows returned, which is fine
    throw new Error(errorHandler(fetchError));
  }

  if (favorite) {
    // If favorite exists, delete it
    const { error: deleteError } = await supabase
      .from("user_favorites")
      .delete()
      .eq("journey_id", journeyId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(errorHandler(deleteError));
    }
    return null;
  }

  // If no existing favorite, insert new one
  const { data, error } = await supabase
    .from("user_favorites")
    .insert([{ journey_id: journeyId, user_id: userId }])
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};
