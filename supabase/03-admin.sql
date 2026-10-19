-- Replace YOUR_ADMIN_AUTH_USER_UUID with the UUID from Authentication > Users.
-- Use the same UUID in ADMIN_USER_ID on Vercel and .env.local.
insert into public.admin_users(user_id) values ('YOUR_ADMIN_AUTH_USER_UUID'::uuid) on conflict do nothing;
