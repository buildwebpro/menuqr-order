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
        label="ชื่อเต็ม"
        name="name"
        type="text"
        placeholder="ชื่อของคุณ"
        required
        autoComplete="name"
        error={state.fieldErrors?.name?.[0]}
      />
      <Input
        label="อีเมล"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
      />
      <Input
        label="รหัสผ่าน"
        name="password"
        type="password"
        placeholder="อย่างน้อย 8 ตัวอักษร"
        required
        autoComplete="new-password"
        error={state.fieldErrors?.password?.[0]}
      />
      <Button type="submit" className="w-full" loading={isPending}>
        สร้างบัญชี
      </Button>
    </form>
  );
}
