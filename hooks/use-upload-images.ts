import { createClient } from "@/lib/supabase/client";
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "./use-toast";
import { useAuth } from "@/lib/supabase/provider";

const useUploadImages = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<string[]>([]);

  const checkMimeType = (file: { type: string }) => {
    // Allowed mime types
    const types = ["image/png", "image/jpeg", "image/gif"];
    return types.includes(file.type);
  };

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const files = event.target.files;

      if (!user?.id || !files) {
        toast({
          description: "Failed to upload images. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (checkMimeType(file)) {
          // Create a unique file name for each image
          const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
          const fileName = `private/${user.id}/uploaded_image_${uniqueSuffix}.png`;

          const { data, error } = await supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            console.error("Error uploading file:", error.message);
            toast({
              description: `Failed to upload image ${file.name}.`,
              variant: "destructive",
            });
          } else if (data) {
            const imageURL = supabase.storage
              .from("journey-development")
              .getPublicUrl(fileName).data.publicUrl;
            uploadedUrls.push(imageURL);
          }
        } else {
          toast({
            description: `File type not supported for ${file.name}. Accept .jpg, .gif, and .png only.`,
            variant: "destructive",
          });
        }
      }

      setValues(uploadedUrls);
      setLoading(false);
    },
    [supabase, user]
  );

  return { handleFileInputChange, loading, values };
};

export default useUploadImages;
