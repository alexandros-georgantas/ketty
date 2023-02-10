create table file (
  -- base
  id uuid primary key,
  type text not null,
  created timestamp with time zone not null default current_timestamp,
  updated timestamp with time zone,

  -- ketida base
  deleted boolean default false,

  --foreign
  book_id uuid references book,
  book_component_id uuid references book_component,
  template_id uuid references template,
  reference_id uuid,
  size int,
  foreign_type text,
  mimetype text,
  source text,
  tags text[],
  name text not null
);