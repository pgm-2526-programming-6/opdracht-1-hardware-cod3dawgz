import { API } from "@core/network/supabase/api";
import { Campus } from "./types.campuses";

export const getCampuses = async (): Promise<Campus[]> => {
  const { data } = await API.from("campuses").select("*").order("name").throwOnError();
  return data;
};

export const getCampusById = async (uid: number): Promise<Campus | null> => {
  const { data } = await API.from("campuses").select("*").eq("id", uid).throwOnError().single();
  return data;
};