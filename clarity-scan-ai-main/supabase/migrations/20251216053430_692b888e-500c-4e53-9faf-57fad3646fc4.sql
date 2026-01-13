-- Create storage bucket for MRI scans
INSERT INTO storage.buckets (id, name, public) 
VALUES ('scans', 'scans', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for scans bucket
CREATE POLICY "Users can upload their own scans"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own scans"
ON storage.objects FOR DELETE
USING (bucket_id = 'scans' AND auth.uid()::text = (storage.foldername(name))[1]);