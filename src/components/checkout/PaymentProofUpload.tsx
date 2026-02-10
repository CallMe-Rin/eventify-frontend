import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, X, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePaymentProofUpload } from '@/hooks/usePaymentProofUpload';

interface PaymentProofUploadProps {
  transactionId: string;
  userId: string;
  onUploadSuccess?: () => void;
}

export function PaymentProofUpload({
  transactionId,
  userId,
  onUploadSuccess,
}: PaymentProofUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadProof, isPending } = usePaymentProofUpload({
    transactionId,
    userId,
    onSuccess: () => {
      setPreview(null);
      setSelectedFile(null);
      onUploadSuccess?.();
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    // Validate file size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadProof({ file: selectedFile });
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Upload Payment Proof</h3>

      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
            dragOver
              ? 'border-primary bg-accent/50'
              : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50',
            isPending && 'opacity-50 cursor-not-allowed',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={isPending}
          />
          <Upload className="size-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">Click or drag to upload</p>
          <p className="text-sm text-muted-foreground mt-1">
            PNG, JPG, JPEG, WebP up to 5MB
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-xl overflow-hidden border">
            <img
              src={preview}
              alt="Payment proof preview"
              className="w-full h-auto max-h-64 object-contain bg-muted"
            />
            {!isPending && (
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 size-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
            >
              <Image className="size-4 mr-2" />
              Change Image
            </Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={handleUpload}
              disabled={isPending || !selectedFile}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  Submit Proof
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Upload a screenshot of your payment confirmation. Make sure the
        transaction ID and amount are clearly visible.
      </p>
    </div>
  );
}
