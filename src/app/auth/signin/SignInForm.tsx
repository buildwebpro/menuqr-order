"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type ActionResult } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initial: ActionResult = { success: false };

export function SignInForm() {
  const [state, action, isPending] = useActionState(signInAction, initial);

  return (
    <form action={action} className="space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3" role="alert">
          {state.error}
        </div>
      )}
      <Input
        label="อีเมล"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
        error={state.fieldErrors?.email?.[0]}
      />
      <div>
        <Input
          label="รหัสผ่าน"
          name="password"
          type="password"
          placeholder="ป้อนรหัสผ่านของคุณ"
          required
          autoComplete="current-password"
          error={state.fieldErrors?.password?.[0]}
        />
        <div className="text-right mt-1">
          <Link href="/auth/forgot-password" className="text-xs text-orange-600 hover:underline">
            ลืมรหัสผ่าน?
          </Link>
        </div>
      </div>
      <Button type="submit" className="w-full" loading={isPending}>
        เข้าสู่ระบบ
      </Button>
    </form>
  );
}
