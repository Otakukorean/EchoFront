"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import EchoLogo from "@/components/logos/echo";
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
import { useRegister } from "@/lib/features/auth/hooks";
import { registerSchema, RegisterSchema } from "@/lib/features/auth/validations";

export default function SignupPage() {
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit({ confirmPassword: _, ...values }: RegisterSchema) {
    // confirmPassword is a UI-only field — strip it before sending to the API
    register(values);
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center px-4 py-12">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-brand/10 absolute top-[-20%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <EchoLogo className="size-7" />
            Echo
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your store
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Free forever. No credit card required.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border-gray-200 dark:border-gray-800 rounded-2xl border p-6 shadow-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-display-name"
                        type="text"
                        placeholder="Your username"
                        autoComplete="name"
                        disabled={isPending}
                        {...field}
                      />
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
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                id="signup-submit"
                type="submit"
                className="mt-1 w-full"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Create account
              </Button>
            </form>
          </Form>
        </div>

        {/* Terms */}
        <p className="text-muted-foreground mt-4 text-center text-xs">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-foreground underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Footer link */}
        <p className="text-muted-foreground mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
