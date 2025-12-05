import { API } from "@core/network/supabase/api";
import { Attendance } from "./types.attendances";

export const getAttendancesByUserId = async (id: string): Promise<Attendance[]> => {
  const { data, error } = await API.from("attendances").select("*").throwOnError();
  return (data as Attendance[]);
};

export const getAttendances = async (): Promise<Attendance[]> => {
  const { data } = await API.from("attendances").select("*").throwOnError(); 
  return Promise.resolve(data);
};