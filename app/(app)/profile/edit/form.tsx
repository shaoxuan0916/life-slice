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
import errorHandler from "@/lib/error.handler";
import { toast } from "@/hooks/utils/use-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useEditUser } from "@/hooks/user.hook";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "At least 3 characters" }),
  username: z.string().min(6, { message: "At least 6 characters" }),
});

type FormSchema = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: UserInfo;
}

export default function EditProfileForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.full_name || "",
      username: user.username,
    },
  });

  const mutation = useEditUser();

  const onSubmit = async (data: FormSchema) => {
    setLoading(true);
    try {
      const updatedData = {
        full_name: data.fullName,
        username: data.username,
      };
      await mutation.mutateAsync(updatedData);
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1000px] pt-8 md:pt-0 flex md:items-center">
      <div className="w-full">
        <h3 className="text-2xl font-bricolage font-semibold mb-12">
          Edit Profile
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-input"
                      placeholder="What is your name?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className="border-input"
                      placeholder="What is your username?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
