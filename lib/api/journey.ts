import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";
import { fetchUser } from "./user";

const supabase = createClient();

export const fetchPublicJourneys = async (
  searchText?: string,
  start: number = 0,
  end: number = 9
) => {
  let query = supabase
    .from("journeys")
    .select(
      `
      *,
      users (
        id,
        username
      )
      `
    )
    .eq("is_public", true)
    .order("updated_at", { ascending: false })
    .range(start, end);

  if (searchText !== "") {
    query = query.textSearch("name", `%${searchText}%`);
  }

  const { data: journeys, error } = await query;

  if (error) {
    throw new Error(errorHandler(error));
  }
  return journeys;
};

export const fetchUserJourneys = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data: journeys, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(errorHandler(error));
  }
  return journeys;
};

export const fetchJourneyById = async (id: string) => {
  const { data: journeys, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(errorHandler(error));
  }
  return journeys;
};

export const createJourney = async (
  name: string,
  description?: string,
  coverImgUrl?: string,
  isPublic?: boolean
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const userData = await fetchUser();
  const userJourneys = await fetchUserJourneys();

  if (userJourneys.length >= 3 && !userData[0].is_pro) {
    throw new Error("Upgrade to premium to create more than 3 journeys.");
  }

  const { data, error } = await supabase
    .from("journeys")
    .insert([
      {
        user_id: userId,
        name,
        description,
        cover_img_url: coverImgUrl,
        is_public: isPublic,
      },
    ])
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};

export const editJourneyById = async (
  journeyId: string,
  name: string,
  description?: string,
  coverImgUrl?: string,
  isPublic?: boolean
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data, error } = await supabase
    .from("journeys")
    .update({
      name,
      description,
      cover_img_url: coverImgUrl,
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", journeyId)
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};

export const deleteJourneyById = async (id: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { error } = await supabase.from("journeys").delete().eq("id", id);

  if (error) {
    throw new Error(errorHandler(error));
  }

  return true;
};
