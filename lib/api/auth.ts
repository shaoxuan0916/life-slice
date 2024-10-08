import { Provider } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error instanceof Error) {
      throw new Error(`Error during login: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during login");
    }
  }
  return data;
};

export const signup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error("An unknown error occurred during signup");
    }
  }
  return data;
};

export const otpLogin = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "http://localhost:3000",
    },
  });
};

export const socialLogin = async (provider: Provider) => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: "http://localhost:3000",
    },
  });
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("An error occured while signing out.", error);
};
