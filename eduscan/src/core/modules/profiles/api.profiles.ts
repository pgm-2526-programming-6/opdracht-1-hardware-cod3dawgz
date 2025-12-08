import { API } from "@core/network/supabase/api";
import { Profile } from "./types.profiles";

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data } = await API.from("profiles").select("*").eq("id", id).single().throwOnError();
  
  return Promise.resolve(data);
};

export const getProfiles = async (): Promise<Profile[]> => {
  const { data } = await API.from("profiles").select("*").throwOnError(); 
  return Promise.resolve(data);
};