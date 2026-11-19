/**
 * Thin `next/headers` wrappers around the session store (spec S4). The pure
 * session logic lives in `./session.ts` and carries the unit tests; these
 * wrappers are verified by the production build and the closure probe.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "../db/index";
import { SESSION_COOKIE, getSessionByToken } from "./session";

/** The logged-in user for this request, or a redirect to `/login`. */
export async function requireUser(): Promise<{ userId: number }> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const session = getSessionByToken(getDb(), token, new Date().toISOString());
  if (!session) redirect("/login");
  return { userId: session.userId };
}
