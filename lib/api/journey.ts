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

export const deleteJourneyById = async (id: string) => {
  const { error } = await supabase.from("journeys").delete().eq("id", id);

  if (error) {
    throw new Error(errorHandler(error));
  }

  return true;
};

// TODO: move create/edit function to here
