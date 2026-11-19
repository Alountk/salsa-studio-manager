"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/index";
import { attemptLogin } from "@/lib/auth/login-core";
import { SESSION_COOKIE, createSession, destroySessionByToken } from "@/lib/auth/session";

export type LoginState = { error: string | null };

const SESSION_MAX_AGE_SECONDS = 7 * 24 * 3600;

/** Server action behind the login form: verify, set the session cookie, redirect home. */
export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  const result = attemptLogin(getDb(), email, password, ip);
  if (!result.ok) return { error: result.error };

  const token = createSession(getDb(), result.userId, new Date().toISOString());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  redirect("/");
}

/** Server action behind the topbar's "Cerrar sesión" button. */
export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) destroySessionByToken(getDb(), token);
  redirect("/login");
}
