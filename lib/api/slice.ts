import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const fetchJourneySlices = async (journeyId: string) => {
  const { data: slices, error } = await supabase
    .from("slices")
    .select("*")
    .eq("journey_id", journeyId)
    .order("slice_date", { ascending: false });

  if (error) {
    throw new Error(errorHandler(error));
  }
  return slices;
};

export const fetchSliceById = async (id: string) => {
  const { data: slice, error } = await supabase
    .from("slices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(errorHandler(error));
  }
  return slice;
};

export const createSlice = async (
  journeyId: string,
  name: string,
  description: string,
  imgUrls: string[],
  sliceDate: string
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data, error } = await supabase
    .from("slices")
    .insert([
      {
        journey_id: journeyId,
        user_id: userId,
        name,
        description,
        img_urls: imgUrls,
        slice_date: sliceDate,
      },
    ])
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};

export const editSliceById = async (
  sliceId: string,
  name: string,
  description: string,
  imgUrls: string[],
  sliceDate: string
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data, error } = await supabase
    .from("slices")
    .update({
      name,
      description,
      img_urls: imgUrls,
      slice_date: sliceDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sliceId)
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};

export const deleteSliceById = async (id: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { error } = await supabase.from("slices").delete().eq("id", id);

  if (error) {
    throw new Error(errorHandler(error));
  }

  return true;
};
