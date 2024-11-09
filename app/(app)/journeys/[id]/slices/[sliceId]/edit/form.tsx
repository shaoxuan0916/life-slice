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
import { ArrowUpFromLine } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { deleteSliceById, editSliceById } from "@/lib/api/slice";
import DatePicker from "@/components/common/datepicker";
import useUploadImages from "@/hooks/use-upload-images";
import ConfirmModal from "@/components/common/confirm-modal";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/common/loader";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  description: z.string(),
  imgUrls: z.array(z.string()),
  sliceDate: z.string().datetime(),
});

interface EditSliceFormProps {
  journeyId: string;
  slice: Slice;
}

export default function EditSliceForm({
  slice,
  journeyId,
}: EditSliceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const {
    handleFileInputChange,
    loading: uploadingImages,
    values: uploadedImageUrls,
  } = useUploadImages();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: slice.name,
      description: slice.description,
      imgUrls: slice.img_urls,
      sliceDate: new Date(slice.slice_date).toISOString(),
    },
  });
  const { setValue, watch } = form;

  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      setValue("imgUrls", uploadedImageUrls);
    }
  }, [uploadedImageUrls, setValue]);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const sliceId = slice.id;
    const { name, description, imgUrls, sliceDate } = values;
    setLoading(true);
    try {
      const data = await editSliceById(
        sliceId,
        name,
        description,
        imgUrls,
        sliceDate
      );
      if (data) {
        queryClient.invalidateQueries({
          queryKey: ["slice"],
          refetchType: "active",
        });
        toast({
          description: "Slice updated!",
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
    <div className="flex-1 w-full max-w-[600px] mx-auto flex md:items-center py-12 md:pt-16 px-4">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-bricolage text-primary">
            Edit {slice.name}
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
          title={`Are you sure you want to delete ${slice.name}?`}
          variant="destructive"
          confirmText="Delete"
          close={() => setShowModal(false)}
          onConfirm={async () => {
            await deleteSliceById(slice.id);
            toast({ description: "Slice deleted!" });
            router.push(`/journeys/${journeyId}`);
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
                  {watch("imgUrls") &&
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
                  {uploadingImages && <Loader />}
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
