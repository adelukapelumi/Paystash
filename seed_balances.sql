-- 1. First, create profiles for any users that signed up BEFORE the tables existed
insert into public.profiles (id, email, full_name, balance)
select id, email, raw_user_meta_data->>'full_name', 0.00
from auth.users
where id not in (select id from public.profiles);

-- 2. Now update the balances for your test accounts
-- IMPORTANT: Change these emails to your specific test account emails!
UPDATE public.profiles
SET balance = 2000.00
WHERE email IN ('email1@example.com', 'email2@example.com');

-- 3. Verify the results
SELECT email, balance FROM public.profiles;
