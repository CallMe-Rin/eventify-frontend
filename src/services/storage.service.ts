import { supabase, STORAGE_BUCKETS } from '@/config/supabase';

interface UploadPaymentProofParams {
  file: File;
  userId: string;
  transactionId: string;
}

interface UploadResult {
  url: string;
  path: string;
}

export async function uploadPaymentProof({
  file,
  userId,
  transactionId,
}: UploadPaymentProofParams): Promise<UploadResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Validate file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  // Generate unique file path
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const filePath = `${userId}/${transactionId}/${fileName}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PAYMENT_PROOFS)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage
    .from(STORAGE_BUCKETS.PAYMENT_PROOFS)
    .getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path,
  };
}
