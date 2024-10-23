import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const fetchJourneys = async () => {
  const { data: journeys, error } = await supabase.from("journeys").select("*");

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
  userId: string,
  name: string,
  description?: string,
  coverImgUrl?: string
) => {
  const { data, error } = await supabase
    .from("journeys")
    .insert([
      {
        user_id: userId,
        name,
        description,
        cover_img_url: coverImgUrl,
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
  coverImgUrl?: string
) => {
  const { data, error } = await supabase
    .from("journeys")
    .update({
      name,
      description,
      cover_img_url: coverImgUrl,
    })
    .eq("id", journeyId)
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};

export const deleteJourneyById = async (id: string) => {
  const { error } = await supabase.from("journeys").delete().eq("id", id);

  if (error) {
    throw new Error(errorHandler(error));
  }

  return true;
};
