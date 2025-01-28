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
import { otpLogin, socialLogin } from "@/lib/api/auth";
import { SendHorizonalIcon } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
});

export default function LoginForm() {
  const [loading, setLoading] = useState<boolean>(false);

  // 1. Define form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      try {
        await otpLogin(values.email);

        toast({
          description:
            "Magic link has been sent to your email. Please check your inbox to log in!",
        });
      } catch (error) {
        toast({ description: errorHandler(error), variant: "destructive" });
      }
    } catch (error: unknown) {
      toast({ description: errorHandler(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
      <Image
        src="/assets/vectors/signup.svg"
        alt="signup"
        width={200}
        height={200}
        className="w-full max-w-[250px] md:max-w-[400px] h-auto mx-auto hidden md:flex"
      />
      <div className="w-full">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Log in / Sign up
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-input"
                      placeholder="someone@hotmail.com"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" loading={loading}>
              <SendHorizonalIcon width={16} height={16} />
              Send Magic Link
            </Button>
          </form>
        </Form>

        <Button
          className="mt-4 w-full border-primary"
          variant="outline"
          onClick={async () => {
            try {
              await socialLogin("google");
            } catch (error) {
              toast({
                description: errorHandler(error),
                variant: "destructive",
              });
            }
          }}
        >
          <Image
            src="/assets/vectors/google-icon.svg"
            alt="google-icon"
            width={16}
            height={16}
          />
          <p>Continue with Google</p>
        </Button>
        <div className="mt-4 ml-1 flex items-center gap-2 text-sm">
          Don&apos;t want to login?
          <Link href="/" className="font-semibold">
            Continue anonymously
          </Link>
        </div>
      </div>
    </div>
  );
}
