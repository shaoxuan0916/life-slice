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
import { toast } from "@/hooks/utils/use-toast";
import { ArrowUpFromLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import useUploadImage from "@/hooks/utils/use-upload-image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import ConfirmModal from "@/components/common/confirm-modal";
import { deleteJourneyById } from "@/lib/api/journey";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/common/loader";
import { useEditJourneyById } from "@/hooks/journey.hook";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  description: z.string().optional(),
  coverImgUrl: z.string().optional(),
  isPublic: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

interface EditJourneyFormProps {
  journey: Journey;
}

export default function EditJourneyForm({ journey }: EditJourneyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const {
    handleFileInputChange,
    loading: uploadingImage,
    value: uploadedImageUrl,
  } = useUploadImage();

  const mutation = useEditJourneyById(journey.id);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: journey.name,
      description: journey.description || undefined,
      coverImgUrl: journey.cover_img_url || undefined,
      isPublic: journey.is_public || false,
    },
  });
  const { setValue, watch } = form;

  useEffect(() => {
    if (uploadedImageUrl) {
      setValue("coverImgUrl", uploadedImageUrl);
    }
  }, [uploadedImageUrl, setValue]);

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const updatedData = {
        name: data.name,
        description: data.description,
        cover_img_url: data.coverImgUrl,
        is_public: data.isPublic,
      };
      await mutation.mutateAsync(updatedData);
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[600px] mx-auto flex md:items-center py-12 md:pt-8 px-4">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl text-primary truncate font-bricolage">
            Edit {journey.name}
          </h3>
          <Button
            variant="destructive"
            onClick={() => setShowModal(true)}
            className="hidden md:block"
          >
            Delete
          </Button>
        </div>

        <ConfirmModal
          open={showModal}
          title={`Are you sure you want to delete ${journey.name}?`}
          variant="destructive"
          confirmText="Delete"
          close={() => setShowModal(false)}
          onConfirm={async () => {
            await deleteJourneyById(journey.id);
            toast({ description: "Journey deleted!" });
            router.push("/journeys");
          }}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-input"
                      placeholder="What is this journey called?"
                      {...field}
                    />
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
                      placeholder="What is this journey about?"
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

            <div className="w-full grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
