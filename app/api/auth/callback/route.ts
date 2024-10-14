import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import config from "@/lib/config";

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

      // If user doesn't exist, insert them into the users table
      if (!existingUser) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            user_id: session.user.id,
            email: session.user.email,
            full_name: "",
            username: "",
            is_verified: true,
            is_pro: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Error inserting new user:", insertError.message);
        } else {
          // console.log("New user inserted successfully");
        }
      }
    }
  });

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + config.auth.callbackUrl);
}
