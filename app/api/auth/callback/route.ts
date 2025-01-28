import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import config from "@/lib/config";
// import { generateUsername } from "@/lib/functions";

export const dynamic = "force-dynamic";

// This route is called after a successful login. It exchanges the code for a session and redirects to the callback URL (see config.js).
export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = createClient();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Supabase subscription for auth state changes (login)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // Check if the user already exists in the users table
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking for existing user:", error.message);
        return;
      }

      console.log("Existing user:", existingUser);

      // If user doesn't exist, insert them into the users table
      // if (!existingUser) {
      //   const { error: insertError } = await supabase.from("users").insert([
      //     {
      //       user_id: session.user.id,
      //       email: session.user.email,
      //       full_name: "",
      //       username: generateUsername(),
      //       is_verified: true,
      //       is_pro: false,
      //       created_at: new Date().toISOString(),
      //       updated_at: new Date().toISOString(),
      //     },
      //   ]);

      //   if (insertError) {
      //     console.error("Error inserting new user:", insertError.message);
      //   } else {
      //     console.log("New user inserted successfully");
      //   }
      // }

      // Now already switch to supabase trigger functions for better performance
      //   declare
      //   random_username text;
      //   begin
      //   -- Generate a random 8-character alphanumeric string
      //   random_username := substring(md5(random()::text), 1, 8);

      //   insert into public.users (
      //     id,
      //     user_id,
      //     email,
      //     full_name,
      //     username,
      //     is_pro,
      //     is_verified,
      //     created_at,
      //     updated_at
      //   )
      //   values (
      //     new.id,
      //     new.id,  -- assuming `user_id` is the same as `id`
      //     new.email,
      //     null,
      //     random_username,
      //     true,  -- default value for is_pro
      //     true,  -- default value for is_verified
      //     now(),  -- sets created_at to current timestamp
      //     now()   -- sets updated_at to current timestamp
      //   );
      //   return new;
      // end;
    }
  });

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
