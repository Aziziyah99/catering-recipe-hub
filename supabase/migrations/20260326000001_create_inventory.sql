create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quantity numeric not null default 0,
  unit text not null default 'piece',
  category text not null default 'General',
  low_stock_threshold numeric default 0,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inventory enable row level security;

create policy "Allow all access to inventory" on public.inventory
  for all using (true) with check (true);
