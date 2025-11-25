import { API } from "@core/network/supabase/api";
import { User } from "./types.users";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await API.from("users").select("*").throwOnError(); 
  return Promise.resolve(data);
};

export const getUserById = async (uid: number): Promise<User | null> => {
  const response = await API.from("users").select("*").eq("id", uid).throwOnError().single();
  return Promise.resolve(response.data);
};