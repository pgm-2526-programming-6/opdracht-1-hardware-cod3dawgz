import { Tables } from "@core/network/supabase/database.types";
import { Campus } from "../campuses/types.campuses";

export type Attendance = Tables<"attendances">;

export type AttendanceWithCampus = Attendance & {
  campus: Campus;
};