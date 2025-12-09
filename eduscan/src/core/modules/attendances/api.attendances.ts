import { API } from "@core/network/supabase/api";
import {
  AttendanceWithCampus,
  AttendanceWithStudent,
} from "./types.attendances";

export const getAttendances = async (): Promise<AttendanceWithCampus[]> => {
  const { data } = await API.from("attendances")
    .select("*, campus:campuses(*)")
    .throwOnError();
  return data;
};

export const getAttendancesByUserId = async (uid: string) => {
  const { data } = await API.from("attendances")
    .select("*, campus:campuses(*)")
    .eq("student_id", uid)
    .throwOnError();
  return data;
};

export const getAttendancesByTeacherId = async (
  uid: string
): Promise<AttendanceWithStudent[]> => {
  const { data } = await API.from("attendances")
    .select("*, student:profiles!student_id(*), campus:campuses(*)")
    .eq("teacher_id", uid)
    .throwOnError();
  return data;
};
