-- Base segura do MandatoGov: dados pessoais e vínculos de indicação.
create extension if not exists pgcrypto;

create type public.papel_usuario as enum ('admin', 'operador', 'consulta');
create type public.esfera_governo as enum ('municipal', 'estadual', 'federal', 'outro');
create type public.status_indicacao as enum ('em_analise', 'aguardando_vaga', 'ativo', 'suspenso', 'desligado');

create table public.perfis_usuario (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel public.papel_usuario not null default 'consulta',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mandatos (
  id uuid primary key default gen_random_uuid(),
  titular_nome text not null,
  cargo_eletivo text not null,
  esfera public.esfera_governo not null,
  partido text,
  uf char(2) not null default 'CE',
  municipio text,
  inicio_em date not null,
  fim_em date,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (fim_em is null or fim_em >= inicio_em)
);

create table public.liderancas (
  id uuid primary key default gen_random_uuid(),
  mandato_id uuid not null references public.mandatos(id) on delete cascade,
  nome_completo text not null,
  telefone text,
  email text,
  area_atuacao text,
  bairro_referencia text,
  observacoes text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pessoas (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  cpf text not null,
  cpf_hash text not null unique,
  telefone text,
  email text,
  endereco_residencial text,
  bairro_residencia text,
  cep text,
  cidade text not null default 'Fortaleza',
  uf char(2) not null default 'CE',
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cpf ~ '^[0-9]{11}$')
);

create table public.orgaos_publicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  sigla text,
  esfera public.esfera_governo not null,
  cnpj text,
  endereco text not null,
  bairro text,
  cidade text,
  uf char(2),
  telefone text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.empresas_terceirizadas (
  id uuid primary key default gen_random_uuid(),
  razao_social text not null,
  nome_fantasia text,
  cnpj text unique,
  telefone text,
  email text,
  endereco text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.postos_trabalho (
  id uuid primary key default gen_random_uuid(),
  orgao_publico_id uuid not null references public.orgaos_publicos(id) on delete restrict,
  empresa_terceirizada_id uuid references public.empresas_terceirizadas(id) on delete restrict,
  nome text not null,
  endereco text not null,
  bairro text,
  cidade text,
  uf char(2),
  contrato_referencia text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cargos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  tipo_vinculo text not null,
  orgao_publico_id uuid references public.orgaos_publicos(id) on delete set null,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.indicacoes (
  id uuid primary key default gen_random_uuid(),
  mandato_id uuid not null references public.mandatos(id) on delete restrict,
  lideranca_id uuid references public.liderancas(id) on delete set null,
  pessoa_id uuid not null references public.pessoas(id) on delete restrict,
  cargo_id uuid references public.cargos(id) on delete set null,
  posto_trabalho_id uuid references public.postos_trabalho(id) on delete set null,
  status public.status_indicacao not null default 'em_analise',
  remuneracao_mensal numeric(12,2),
  indicada_em date not null default current_date,
  nomeada_em date,
  desligada_em date,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (remuneracao_mensal is null or remuneracao_mensal >= 0),
  check (desligada_em is null or desligada_em >= indicada_em)
);

create table public.historico_indicacoes (
  id uuid primary key default gen_random_uuid(),
  indicacao_id uuid not null references public.indicacoes(id) on delete cascade,
  evento text not null,
  descricao text,
  dados_anteriores jsonb,
  dados_novos jsonb,
  realizado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_liderancas_mandato on public.liderancas(mandato_id);
create index idx_pessoas_cpf_hash on public.pessoas(cpf_hash);
create index idx_postos_orgao on public.postos_trabalho(orgao_publico_id);
create index idx_postos_empresa on public.postos_trabalho(empresa_terceirizada_id);
create index idx_indicacoes_mandato_status on public.indicacoes(mandato_id, status);
create index idx_indicacoes_pessoa on public.indicacoes(pessoa_id);

create or replace function public.papel_atual()
returns public.papel_usuario
language sql stable security definer set search_path = public
as $$ select papel from public.perfis_usuario where id = auth.uid() and ativo $$;

create or replace function public.pode_editar()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(public.papel_atual() in ('admin', 'operador'), false) $$;

create or replace function public.registrar_alteracao_indicacao()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.historico_indicacoes(indicacao_id, evento, dados_novos, realizado_por)
    values (new.id, 'criada', to_jsonb(new), auth.uid());
  elsif tg_op = 'UPDATE' then
    insert into public.historico_indicacoes(indicacao_id, evento, dados_anteriores, dados_novos, realizado_por)
    values (new.id, 'atualizada', to_jsonb(old), to_jsonb(new), auth.uid());
  end if;
  return new;
end; $$;

create trigger indicacoes_auditoria
after insert or update on public.indicacoes
for each row execute function public.registrar_alteracao_indicacao();

do $$ declare tabela text;
begin
  foreach tabela in array array['perfis_usuario','mandatos','liderancas','pessoas','orgaos_publicos','empresas_terceirizadas','postos_trabalho','cargos','indicacoes','historico_indicacoes']
  loop
    execute format('alter table public.%I enable row level security', tabela);
    execute format('revoke all on public.%I from anon, authenticated', tabela);
    execute format('grant select on public.%I to authenticated', tabela);
  end loop;
end $$;

do $$ declare tabela text;
begin
  foreach tabela in array array['mandatos','liderancas','pessoas','orgaos_publicos','empresas_terceirizadas','postos_trabalho','cargos','indicacoes']
  loop
    execute format('grant insert, update, delete on public.%I to authenticated', tabela);
  end loop;
end $$;

create policy "Usuários autenticados podem consultar perfis" on public.perfis_usuario
for select to authenticated using (id = auth.uid() or public.papel_atual() = 'admin');

create policy "Administradores gerenciam perfis" on public.perfis_usuario
for all to authenticated using (public.papel_atual() = 'admin') with check (public.papel_atual() = 'admin');

do $$ declare tabela text;
begin
  foreach tabela in array array['mandatos','liderancas','pessoas','orgaos_publicos','empresas_terceirizadas','postos_trabalho','cargos','indicacoes']
  loop
    execute format('create policy "Leitura por usuários autorizados" on public.%I for select to authenticated using (public.papel_atual() is not null)', tabela);
    execute format('create policy "Edição por administradores e operadores" on public.%I for all to authenticated using (public.pode_editar()) with check (public.pode_editar())', tabela);
  end loop;
end $$;

create policy "Histórico visível a usuários autorizados" on public.historico_indicacoes
for select to authenticated using (public.papel_atual() is not null);
