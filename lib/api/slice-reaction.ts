import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const fetchSliceReactions = async (sliceId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  const { data: reactions, error } = await supabase
    .from("slice_reactions")
    .select("*")
    .eq("slice_id", sliceId);

  if (error) {
    throw new Error(errorHandler(error));
  }

  const groupedReactions = reactions.reduce((acc, reaction) => {
    const { type } = reaction;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        isReacted: false,
      };
    }
    acc[type].count++;
    if (reaction.user_id === userId) {
      acc[type].isReacted = true;
    }
    return acc;
  }, {} as Record<string, { count: number; isReacted: boolean }>);

  return groupedReactions;
};

// Add or remove slice reaction
export const handleSliceReaction = async (
  sliceId: string,
  type: string,
  emoji: string
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  // Check if reaction already exists
  const { data: existingReaction, error: fetchError } = await supabase
    .from("slice_reactions")
    .select("*")
    .eq("slice_id", sliceId)
    .eq("user_id", userId)
    .eq("type", type)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 means no rows returned, which is fine
    throw new Error(errorHandler(fetchError));
  }

  if (existingReaction) {
    // If reaction exists, delete it
    const { error: deleteError } = await supabase
      .from("slice_reactions")
      .delete()
      .eq("slice_id", sliceId)
      .eq("user_id", userId)
      .eq("type", type);

    if (deleteError) {
      throw new Error(errorHandler(deleteError));
    }
    return null;
  }

  // If no existing reaction, insert new one
  const { data, error } = await supabase
    .from("slice_reactions")
    .insert([{ slice_id: sliceId, user_id: userId, type, emoji }])
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};
