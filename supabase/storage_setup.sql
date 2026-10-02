-- Create a new private bucket for user documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS) on the storage.objects table
alter table storage.objects enable row level security;

-- Policy: Users can upload documents to their own folder (folder name = user.id)
create policy "Users can upload their own documents"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'documents' and
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

-- Policy: Users can update their own documents
create policy "Users can update their own documents"
on storage.objects for update
to authenticated
using (
  bucket_id = 'documents' and
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

-- Policy: Users can view/download their own documents
create policy "Users can view their own documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'documents' and
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

-- Policy: Users can delete their own documents
create policy "Users can delete their own documents"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'documents' and
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);
