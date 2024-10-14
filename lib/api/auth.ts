import { Provider } from "@supabase/supabase-js";
import errorHandler from "../error.handler";
import { createClient } from "../supabase/client";

const supabase = createClient();

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
  const redirectURL = window.location.origin + "/api/auth/callback";
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectURL,
    },
  });

  if (error) {
    console.log("error:", error);
    throw new Error(errorHandler(error));
  }

  return data;
};

export const socialLogin = async (provider: Provider) => {
  const redirectURL = window.location.origin + "/api/auth/callback";
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectURL,
    },
  });
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  window.location.href = "/";
  if (error) throw new Error("An error occured while signing out.", error);
};
