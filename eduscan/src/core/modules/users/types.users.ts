import { Tables, TablesInsert, TablesUpdate } from "@core/network/supabase/database.types";

export type User = Tables<"users">;

export type CreateUserBody = TablesInsert<"users">;
export type UpdateUserBody = TablesUpdate<"users">;