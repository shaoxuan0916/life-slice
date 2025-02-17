"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import errorHandler from "@/lib/error.handler";
import { toast } from "@/hooks/utils/use-toast";
import { ArrowUpFromLine, CropIcon, PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/common/back-button";
import DatePicker from "@/components/common/datepicker";
import useUploadImages from "@/hooks/utils/use-upload-images";
import ImageCropper from "./partials/image-cropper";
import { useCreateSlice } from "@/hooks/slice.hook";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  description: z.string(),
  imgUrls: z.array(z.string()),
  sliceDate: z.string().datetime(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateSliceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  // Store images in local state
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  // Image cropper
  const [imageToCrop, setImageToCrop] = useState<string | undefined>(undefined);
  const [imageToCropIndex, setImageToCropIndex] = useState<number | undefined>(
    undefined
  );
  const [croppedImage, setCroppedImage] = useState<File | undefined>(undefined);

  // Upload images to supabase storage
  const { handleUploadImages, loading: uploadingImages } = useUploadImages();

  const journeyId = searchParams.get("journeyId") as string;
  const title = searchParams.get("title") as string;

  const mutation = useCreateSlice();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imgUrls: [],
      sliceDate: new Date().toISOString(),
    },
  });

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const imageUrls = await handleUploadImages(uploadedImages);
      const updatedData = {
        journey_id: journeyId,
        name: data.name,
        description: data.description,
        img_urls: imageUrls || [],
        slice_date: data.sliceDate,
      };
      await mutation.mutateAsync(updatedData);
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle files change (local upload)
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 4) {
      toast({
        variant: "destructive",
        description: "You can only upload a maximum of 4 photos.",
      });
      return;
    }
    if (files) {
      const fileArray = Array.from(files);
      setUploadedImages(fileArray);
    }
  };

  // Function to select image to crop
  const onSelectCropImage = ({
    file,
    index,
  }: {
    file: File;
    index: number;
  }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setImageToCropIndex(index);
    };
    reader.readAsDataURL(file);
  };

  // Function to clear image cropper state
  const clearCropImageState = () => {
    setImageToCrop(undefined);
    setImageToCropIndex(undefined);
    setCroppedImage(undefined);
  };

  return (
    <div className="flex-1 w-full inset-0 relative h-screen max-w-[600px] mx-auto flex md:items-center pt-4 pb-12 md:pt-0 px-4">
      {imageToCrop && (
        <div className="fixed inset-0 z-50 flex items-center bg-black/75 justify-center">
          <div className="max-w-[500px] w-full h-auto relative bg-white rounded-lg p-4">
            <ImageCropper
              imageToCrop={imageToCrop}
              onImageCropped={(croppedImage: File) => {
                setCroppedImage(croppedImage);
              }}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant="destructive"
                onClick={clearCropImageState}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (croppedImage && imageToCropIndex !== undefined) {
                    setUploadedImages((prev) => {
                      const updatedImages = [...prev];
                      updatedImages[imageToCropIndex] = croppedImage;
                      return updatedImages;
                    });
                  }
                  clearCropImageState();
                }}
              >
                Crop
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="flex items-center gap-8 mb-8">
          <BackButton />
          <div className="fle flex-col gap-2">
            <h3 className="text-2xl md:text-3xl font-bricolage text-primary">
              Create a new Slice
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-semibold">
              of {title}
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="border-input" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="border-input"
                      placeholder=""
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sliceDate"
              render={({ field }) => (
                <DatePicker
                  label="Date"
                  date={field.value}
                  setDate={field.onChange}
                  disabledMatcher={{ after: new Date() }}
                />
              )}
            />
            {/* Image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Images</FormLabel>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((file, i) => {
                    return (
                      <div key={i} className="relative">
                        <CropIcon
                          className="absolute top-2 right-2 cursor-pointer p-1 bg-black/50 rounded-full"
                          width={28}
                          height={28}
                          onClick={() => onSelectCropImage({ file, index: i })}
                        />
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="slice-image"
                          width={100}
                          height={100}
                          className={cn(
                            "w-full h-auto aspect-square rounded-md object-cover p-0"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" type="button" className="relative">
                  <ArrowUpFromLine
                    width={16}
                    height={16}
                    className="text-primary"
                  />
                  <p className="text-[14px] font-medium text-primary">
                    Upload photos (max 4)
                  </p>
                  <input
                    onChange={onFileChange}
                    type="file"
                    name="file"
                    multiple
                    accept=".gif,.jpg,.png,.jpeg"
                    className="absolute top-0 left-0 right-0 bottom-0 outline-none opacity-0"
                  />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="w-full grid grid-cols-3 gap-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                Cancel
              </Button>
              <Button
                className="col-span-2"
                type="submit"
                loading={loading || uploadingImages}
              >
                <PlusIcon width={16} height={16} />
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
