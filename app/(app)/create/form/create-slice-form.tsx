"use client";

import { useEffect, useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { ArrowUpFromLine, LoaderCircleIcon, PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/common/back-button";
import { createSlice } from "@/lib/api/slice";
import DatePicker from "@/components/common/datepicker";
import useUploadImages from "@/hooks/use-upload-images";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  description: z.string(),
  imgUrls: z.array(z.string()),
  sliceDate: z.string().datetime(),
});

export default function CreateSliceForm() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleFileInputChange,
    loading: uploadingImages,
    values: uploadedImageUrls,
  } = useUploadImages();

  const journeyId = searchParams.get("journeyId") as string;
  const title = searchParams.get("title") as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imgUrls: [],
      sliceDate: new Date().toISOString(),
    },
  });
  const { setValue, watch } = form;

  useEffect(() => {
    if (uploadedImageUrls) {
      setValue("imgUrls", uploadedImageUrls);
    }
  }, [uploadedImageUrls, setValue]);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, description, imgUrls, sliceDate } = values;

    setLoading(true);
    try {
      const userId = user?.id;
      if (!userId) throw new Error("No logged in user.");

      const data = await createSlice(
        journeyId,
        name,
        description,
        imgUrls,
        sliceDate
      );

      if (data) {
        toast({
          description: "New slice created!",
        });
        router.push(`/journeys/${journeyId}`);
      }
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 4) {
      toast({
        variant: "destructive",
        description: "You can only upload a maximum of 4 photos.",
      });
      return;
    }

    handleFileInputChange(event);
  };

  return (
    <div className="flex-1 w-full h-screen max-w-[600px] mx-auto flex md:items-center pt-4 pb-12 md:pt-0 px-4">
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
                  {watch("imgUrls").length > 0 &&
                    form
                      .getValues("imgUrls")
                      .map((img) => (
                        <Image
                          key={img}
                          src={img}
                          alt="slice-image"
                          width={100}
                          height={100}
                          className={cn(
                            "w-full h-full max-w-[180px] max-h-[180px] bg-none rounded-md object-cover p-0"
                          )}
                        />
                      ))}
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
                    accept=".gif,.jpg,.png"
                    className="absolute top-0 left-0 right-0 bottom-0 outline-none opacity-0"
                  />
                  {uploadingImages && (
                    <LoaderCircleIcon
                      width={16}
                      height={16}
                      className="animate-spin"
                    />
                  )}
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
              <Button className="col-span-2" type="submit" loading={loading}>
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
