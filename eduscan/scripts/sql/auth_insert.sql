-- Drop trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Drop function if it exists
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Insert a new row into public.profiles
  -- including the new user's id, first_name, last_name, and email.
  insert into public.profiles (id, first_name, last_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email  -- New: Get the email directly from the 'new' user record
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();