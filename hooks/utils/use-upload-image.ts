import { createClient } from "@/lib/supabase/client";
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "./use-toast";
import { useAuth } from "@/lib/supabase/provider";

const useUploadImage = () => {
  const supabase = createClient();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const checkMimeType = (file: { type: string }) => {
    // Allowed mime type
    const types = ["image/png", "image/jpeg", "image/gif"];
    if (types.every((type) => file.type !== type)) {
      return false;
    }
    return true;
  };

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const file = event.target.files && event.target.files[0];

      if (!user?.id) {
        toast({
          description: "Failed to upload image. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (file && checkMimeType(file)) {
        // Create a unique file name for the image
        const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
        const fileName = `private/${user?.id}/uploaded_image_${uniqueSuffix}.png`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast({
            description: "Failed to upload image. Please try again later.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (data) {
          const imageURL = supabase.storage
            .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
            .getPublicUrl(fileName).data.publicUrl;
          setValue(imageURL);
        }
        setLoading(false);
      } else {
        toast({
          description:
            "File type not supported. Accept .jpg .gif and .png only.",
          variant: "destructive",
        });
        setLoading(false);
      }
    },
    []
  );

  return { handleFileInputChange, loading, value };
};

export default useUploadImage;
