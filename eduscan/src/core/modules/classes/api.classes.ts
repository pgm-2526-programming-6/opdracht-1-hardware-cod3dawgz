import { API } from "@core/network/supabase/api";
import { Class } from "./types.classes";

export const getClassById = async (id: number): Promise<Class | null> => {
  const { data } = await API.from("classes").select("*").eq("id", id).single().throwOnError();
  return Promise.resolve(data);
};