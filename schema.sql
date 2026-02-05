
-- 1. LIMPEZA TOTAL (OPCIONAL - CUIDADO: APAGA DADOS EXISTENTES)
-- Removendo triggers e funções primeiro
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.check_workspace_access(uuid);

-- Removendo tabelas na ordem correta (filhos primeiro por causa das FKs)
drop table if exists transactions;
drop table if exists payables_receivables;
drop table if exists investments;
drop table if exists projects;
drop table if exists cost_centers;
drop table if exists contacts;
drop table if exists accounts;
drop table if exists categories;
drop table if exists workspaces;
drop table if exists profiles;

-- 2. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 3. CORE TABLES
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

create table workspaces (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  type text check (type in ('PERSONAL', 'BUSINESS')) not null,
  currency text default 'BRL',
  regime text check (regime in ('CAIXA', 'COMPETENCIA')) default 'CAIXA',
  created_at timestamp with time zone default now()
);

-- 4. FINANCIAL TABLES
create table accounts (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  type text check (type in ('BANK', 'CASH', 'INVESTMENT')) not null,
  balance numeric default 0,
  currency text default 'BRL',
  created_at timestamp with time zone default now()
);

create table categories (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  color text,
  type text check (type in ('INCOME', 'EXPENSE')) not null,
  created_at timestamp with time zone default now()
);

create table transactions (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  account_id uuid references accounts(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  date date not null,
  competence_date date,
  description text not null,
  value numeric not null,
  type text check (type in ('INCOME', 'EXPENSE')) not null,
  status text check (status in ('CONFIRMED', 'PROJECTED')) default 'CONFIRMED',
  is_recurring boolean default false,
  created_at timestamp with time zone default now()
);

-- 5. BUSINESS & MANAGEMENT TABLES
create table cost_centers (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  type text check (type in ('COST', 'PROFIT')) not null,
  created_at timestamp with time zone default now()
);

create table projects (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  budget numeric default 0,
  spent numeric default 0,
  status text check (status in ('ACTIVE', 'COMPLETED', 'ON_HOLD')) default 'ACTIVE',
  created_at timestamp with time zone default now()
);

create table contacts (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  document text,
  type text check (type in ('CLIENT', 'SUPPLIER', 'BOTH')) not null,
  created_at timestamp with time zone default now()
);

create table payables_receivables (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  title text not null,
  amount numeric not null,
  due_date date not null,
  type text check (type in ('PAYABLE', 'RECEIVABLE')) not null,
  status text check (status in ('PAID', 'PENDING', 'OVERDUE')) default 'PENDING',
  category_id uuid references categories(id) on delete set null,
  created_at timestamp with time zone default now()
);

create table investments (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  symbol text,
  type text check (type in ('STOCK', 'FIXED', 'CRYPTO', 'FII')) not null,
  quantity numeric default 0,
  average_price numeric default 0,
  current_price numeric default 0,
  institution text,
  created_at timestamp with time zone default now()
);

-- 6. SEGURANÇA (RLS)
alter table profiles enable row level security;
alter table workspaces enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table cost_centers enable row level security;
alter table projects enable row level security;
alter table contacts enable row level security;
alter table payables_receivables enable row level security;
alter table investments enable row level security;

-- Criando a função auxiliar de acesso
create or replace function public.check_workspace_access(ws_id uuid) returns boolean as $$
begin
  return exists (select 1 from workspaces where id = ws_id and owner_id = auth.uid());
end;
$$ language plpgsql security definer;

-- Aplicando Políticas
create policy "Own profile access" on profiles for all using (auth.uid() = id);
create policy "Workspace ownership access" on workspaces for all using (auth.uid() = owner_id);
create policy "Workspace members access accounts" on accounts for all using (check_workspace_access(workspace_id));
create policy "Workspace members access categories" on categories for all using (check_workspace_access(workspace_id));
create policy "Workspace members access transactions" on transactions for all using (check_workspace_access(workspace_id));
create policy "Workspace members access cost_centers" on cost_centers for all using (check_workspace_access(workspace_id));
create policy "Workspace members access projects" on projects for all using (check_workspace_access(workspace_id));
create policy "Workspace members access contacts" on contacts for all using (check_workspace_access(workspace_id));
create policy "Workspace members access payables" on payables_receivables for all using (check_workspace_access(workspace_id));
create policy "Workspace members access investments" on investments for all using (check_workspace_access(workspace_id));

-- 7. AUTOMAÇÃO DE PERFIL
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
