-- Create a table for public profiles using the auth.users reference
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for transactions
create table transactions (
    id text primary key, -- UUID or client-generated ID
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    sender_id uuid references auth.users,
    recipient_id uuid references auth.users, -- Can be null if sending to external/QR
    
    amount numeric not null,
    currency text default 'NGN',
    
    type text check (type in ('credit', 'debit', 'topup', 'withdraw')),
    status text check (status in ('pending', 'completed', 'failed', 'locked')),
    
    title text,
    metadata jsonb, -- Store signature, public keys here
    
    -- Security
    signature text
);

alter table transactions enable row level security;

create policy "Users can view their own transactions." on transactions
    for select using (
        auth.uid() = sender_id or auth.uid() = recipient_id
    );

create policy "Users can create transactions." on transactions
    for insert with check (
        auth.uid() = sender_id
    );
