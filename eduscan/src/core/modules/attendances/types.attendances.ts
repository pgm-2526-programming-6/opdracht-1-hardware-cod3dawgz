import { Tables } from "@core/network/supabase/database.types";
import { Campus } from "../campuses/types.campuses";
import { Profile } from "../profiles/types.profiles";

export type Attendance = Tables<"attendances">;

export type AttendanceWithCampus = Attendance & {
  campus: Campus;
};

export type AttendanceWithStudent = AttendanceWithCampus & {
  student: Profile;
  status: string;
};
