import { useState, useEffect } from "react";
import { appwriteAuth } from "@/lib/appwrite";
import type { Models } from "appwrite";

export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    try {
      const currentUser = await appwriteAuth.getCurrentUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Failed to get user");
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    try {
      await appwriteAuth.loginWithEmail(email, password);
      await checkUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await appwriteAuth.logout();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    loginWithEmail,
    logout,
    refetch: checkUser,
  };
}
