"use client";

import { useActionState } from "react";
import { signUpAction, type ActionResult } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: ActionResult = { success: false };

export function SignUpForm() {
  const [state, action, isPending] = useActionState(signUpAction, initial);

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3" role="alert">
          {state.error}
        </div>
      )}
      <Input
        label="Full name"
        name="name"
        type="text"
        placeholder="Your name"
        required
        autoComplete="name"
        error={state.fieldErrors?.name?.[0]}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="At least 8 characters"
        required
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
      />
      <Button type="submit" className="w-full" loading={isPending}>
        Create account
      </Button>
    </form>
  );
}
