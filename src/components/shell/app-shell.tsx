import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * DESIGN.md §Layout → app shell, the frame shared by every authenticated
 * route: 240px sidebar, 64px top bar, content on `background` with 32px padding
 * and a 1280px maximum width.
 *
 * Built once here rather than copied per page, which is acceptance criterion 3
 * of this feature.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-8 py-8">
          <div className="mx-auto w-full max-w-[var(--content-max-width)]">{children}</div>
        </main>
      </div>
    </div>
  );
}
