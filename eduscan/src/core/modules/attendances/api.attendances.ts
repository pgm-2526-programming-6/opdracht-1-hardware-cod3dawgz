import { API } from "@core/network/supabase/api";
import { AttendanceWithCampus } from "./types.attendances";

export const getAttendances = async (): Promise<AttendanceWithCampus[]> => {
  const { data } = await API.from("attendances").select("*, campus:campuses(*)").throwOnError();
  return data;
};

export const getAttendancesByUserId = async (uid: string) => {
  const { data } = await API
    .from("attendances")
    .select("*, campus:campuses(*)")
    .eq("student_id", uid)
    .throwOnError();
  return data;
};
