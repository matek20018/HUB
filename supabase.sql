-- HUB: jedna tabela na wszystkie postępy. Wklej całość w Supabase → SQL Editor → Run.

create table if not exists public.hub_kv (
  user_id    uuid        not null default auth.uid() references auth.users(id) on delete cascade,
  key        text        not null,
  value      jsonb,
  updated_at bigint      not null,               -- kiedy zmieniono na urządzeniu (ms)
  server_at  timestamptz not null default now(), -- kiedy dotarło na serwer (do pobierania zmian)
  primary key (user_id, key)
);
create index if not exists hub_kv_user_server_at on public.hub_kv (user_id, server_at);

-- Każdy widzi i zmienia tylko swoje wiersze.
alter table public.hub_kv enable row level security;
drop policy if exists "hub own select" on public.hub_kv;
drop policy if exists "hub own insert" on public.hub_kv;
drop policy if exists "hub own update" on public.hub_kv;
drop policy if exists "hub own delete" on public.hub_kv;
create policy "hub own select" on public.hub_kv for select using (auth.uid() = user_id);
create policy "hub own insert" on public.hub_kv for insert with check (auth.uid() = user_id);
create policy "hub own update" on public.hub_kv for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hub own delete" on public.hub_kv for delete using (auth.uid() = user_id);

-- Starsza zmiana nigdy nie nadpisze nowszej (np. telefon wraca z offline po kilku dniach).
create or replace function public.hub_kv_guard() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'UPDATE' and new.updated_at < old.updated_at then
    return old;
  end if;
  new.server_at := clock_timestamp();
  return new;
end $$;

drop trigger if exists hub_kv_guard on public.hub_kv;
create trigger hub_kv_guard before insert or update on public.hub_kv
  for each row execute function public.hub_kv_guard();
