"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import errorHandler from "@/lib/error.handler";
import { toast } from "@/hooks/use-toast";
import { ArrowUpFromLine, PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import useUploadImage from "@/hooks/use-upload-image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/supabase/provider";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { createJourney } from "@/lib/api/journey";
import { BackButton } from "@/components/common/back-button";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/common/loader";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  description: z.string().optional(),
  coverImgUrl: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateJourneyForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    handleFileInputChange,
    loading: uploadingImage,
    value: uploadedImageUrl,
  } = useUploadImage();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const { setValue, watch } = form;

  const mutation = useMutation({
    mutationFn: (body: FormSchema) => {
      return createJourney(
        body.name,
        body.description,
        body.coverImgUrl,
        body.isPublic
      );
    },
    async onSuccess(data) {
      toast({
        description: "New journey created!",
      });
      router.push(`/journeys/${data[0].id}`);
    },
    onError(error) {
      toast({ description: errorHandler(error), variant: "destructive" });
    },
  });

  useEffect(() => {
    if (uploadedImageUrl) {
      setValue("coverImgUrl", uploadedImageUrl);
    }
  }, [uploadedImageUrl, setValue]);

  // 2. Define a submit handler.
  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const userId = user?.id;
      if (!userId) throw new Error("No logged in user.");
      await mutation.mutateAsync(data);
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full h-screen max-w-[600px] mx-auto flex md:items-center pt-8 md:pt-0 px-4">
      <div className="w-full">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h3 className="text-2xl md:text-3xl font-bricolage text-primary">
            Create a new Journey
          </h3>
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Set journey as public
                    </FormLabel>
                    <FormDescription>
                      Anyone can view this journey.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Image */}
            <div className="flex flex-col gap-2">
              <FormLabel>Cover Image</FormLabel>
              <div className="flex items-center gap-4">
                <Image
                  src={
                    watch("coverImgUrl") ||
                    "/assets/images/default-cover-image.png"
                  }
                  alt="cover-image"
                  width={100}
                  height={100}
                  className={cn(
                    "rounded-full w-[100px] h-[100px] object-cover",
                    watch("coverImgUrl") && "bg-none object-cover p-0"
                  )}
                />
                <Button variant="ghost" type="button" className="relative">
                  <ArrowUpFromLine
                    width={16}
                    height={16}
                    className="text-primary"
                  />
                  <p className="text-[14px] font-medium text-primary">
                    Upload a photo
                  </p>
                  <input
                    onChange={handleFileInputChange}
                    type="file"
                    name="file"
                    accept=".gif,.jpg,.png"
                    className="absolute top-0 left-0 right-0 bottom-0 outline-none opacity-0"
                  />
                  {uploadingImage && <Loader />}
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
