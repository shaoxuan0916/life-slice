import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const fetchUsers = async () => {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(errorHandler(error));
  }
  return users;
};

export const fetchUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(errorHandler(error));
  }
  return userData;
};

export const editUser = async (fullName: string, username: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  if (!userId) throw new Error("No logged in user.");

  const { data, error } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      username: username,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select();

  if (error) {
    throw new Error(errorHandler(error));
  }

  return data;
};
