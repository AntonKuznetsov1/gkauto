-- Run this once in the Supabase SQL editor for the deployed project.
alter table public.schedules add column if not exists time_slot text;
alter table public.schedules add column if not exists specific_date date;
alter table public.blogs add column if not exists likes integer not null default 0;

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;