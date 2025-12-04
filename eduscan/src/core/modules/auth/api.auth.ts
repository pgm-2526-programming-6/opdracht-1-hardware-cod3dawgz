import { API } from "@core/network/supabase/api";
import { Auth, CreateUserBody, LoginBody } from "./types.auth";

export const registerUser = async (user: CreateUserBody) => {
  const { email, password, ...rest } = user;
  const { data, error } = await API.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...rest,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const getCurrentAuth = async (): Promise<Auth | null> => {
  const {
    data: { session },
  } = await API.auth.getSession();

  if (!session || !session.user) {
    return null;
  }
  const { user } = session;
  const { data: profile } = await API.from("profiles").select("*").eq("id", user.id).single();

  if (!profile) {
    throw new Error("Profile not found for current user");
  }

  return {
    user: {
      ...profile,
      email: profile.email ?? user.email ?? "",
    },
    session,
  };
};

export const login = async ({ email, password }: LoginBody): Promise<Auth> => {
  // 1. Inloggen bij Supabase
  const { data, error } = await API.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data || !data.user) {
    throw new Error("User not found after login");
  }

  // 2. Ook profile informatie opvragen
  const auth = await getCurrentAuth();

  if (!auth) {
    throw new Error("Failed to retrieve auth after login");
  }

  return auth;
};

export const logout = async () => {
  return API.auth.signOut();
};