"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import errorHandler from "@/lib/error.handler";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(3, { message: "At least 3 characters" }),
  email: z.string(),
  message: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;
const SupportPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    const { name, email, message } = values;
    setLoading(true);
    try {
      const result = await fetch("/api/email/user-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (result.ok) {
        toast({
          description: "Feedback sent!",
        });
        form.reset();
      }
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-2xl font-bricolage font-semibold">Get In Touch</h3>
      <p className="mt-2 mb-4 text-md text-neutral-600 dark:text-neutral-400">
        We&apos;d love to hear from you!
      </p>
      <div className="mt-8 lg:mt-16 pb-12 w-full grid grid-cols-1 lg:grid-cols-2 max-w-[1000px] items-center gap-8">
        <Image
          src="/assets/vectors/contact-us.svg"
          alt="contact-us"
          width={200}
          height={200}
          className="w-full max-w-[250px] lg:max-w-[400px] h-auto mx-auto"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="border-input" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
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
            <Button type="submit" className="w-full" loading={loading}>
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SupportPage;
