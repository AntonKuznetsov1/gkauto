-- Run this once in the Supabase SQL editor for the deployed project.
alter table public.blogs add column if not exists likes integer not null default 0;

create table if not exists public.schedule_rules (
	id uuid primary key default gen_random_uuid(),
	type text not null check (type in ('recurring_slot', 'day_off_weekly', 'slot_override', 'date_off_override')),
	day_of_week integer,
	time_slot text,
	specific_date date,
	is_available boolean not null default true,
	created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

notify pgrst, 'reload schema';