"use client";

import {
  useEffect,
  useState,
  createContext,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./client";
import Spinner from "@/components/common/Spinner";
import errorHandler from "../error.handler";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  refreshSession: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
    } catch (error) {
      console.log(errorHandler(error));
      router.push("/login"); // Redirect if token refresh fails
    }
  }, [router]);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();

        if (data?.session?.user) {
          setUser(data.session.user);
          setLoading(false);

          // Redirect to login page if not authenticated
          router.push("/login");
        }
      } catch (error) {
        console.log(errorHandler(error));
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Supabase subscription for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          if (event === "SIGNED_IN") {
            // Check if the user already exists in the users table
            const { data: existingUser, error } = await supabase
              .from("users")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (error) {
              console.error("Error checking for existing user:", error.message);
              return;
            }

            // If user doesn't exist, insert them into the users table
            if (!existingUser) {
              const { error: insertError } = await supabase
                .from("users")
                .insert([
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
                console.log("New user inserted successfully");
              }
            }
          }
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
          router.push("/login");
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    // Auto-refresh token before expiration
    let refreshTokenInterval: NodeJS.Timeout;

    const startTokenRefreshInterval = (session: Session | null) => {
      if (!session) return;
      const tokenExpiresIn = session.expires_in ?? 3600; // Default 1 hour if not provided
      refreshTokenInterval = setTimeout(
        refreshSession,
        (tokenExpiresIn - 60) * 1000
      ); // Refresh 1 minute before expiry
    };

    const setRefreshInterval = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      startTokenRefreshInterval(sessionData?.session);
    };

    setRefreshInterval();

    // Clean up token refresh interval on unmount
    return () => {
      if (refreshTokenInterval) clearTimeout(refreshTokenInterval);
    };
  }, [refreshSession]);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: loading,
        refreshSession: refreshSession,
      }}
    >
      <div className="relative">
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <Spinner className="text-primary" />
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
