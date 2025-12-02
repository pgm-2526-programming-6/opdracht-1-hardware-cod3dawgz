import { TablesInsert } from "@core/network/supabase/database.types";
import { Session } from "@supabase/supabase-js";
import { Profile } from "../profiles/types.profiles";

type CreateProfileBody = Omit<TablesInsert<"profiles">, "id">;

export type Auth = {
  session: Session;
  user: User;
};

export type User = {
  email: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type CreateUserBody = {
  email: string;
  password: string;
};