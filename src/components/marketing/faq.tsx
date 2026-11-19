"use client";

import { useState } from "react";
import { FAQ } from "@/lib/billing";
import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Design 3, screen 01 — FAQ accordion (S1).
 *
 * Client component: rows expand independently (the export's toggleFaq never
 * closes a sibling), first row open by default, chevron rotates and its circle
 * turns terracotta while open.
 */
export function Faq() {
  const [open, setOpen] = useState<number[]>([0]);

  function toggle(index: number) {
    setOpen((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );
  }

  return (
    <section className="mx-auto mb-20 max-w-3xl">
      <div className="mb-10 text-center">
        <h2 className="mb-2 font-display text-headline-lg text-on-surface">
          Preguntas frecuentes
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Resolvemos las dudas más habituales sobre las reservas, formas de pago
          y funcionamiento del estudio.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ.map((item, index) => {
          const isOpen = open.includes(index);
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-card"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span className="font-display text-headline-sm text-on-surface">
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-surface-container transition-colors",
                    isOpen ? "text-primary" : "text-on-surface-variant",
                  )}
                >
                  <Icon
                    name="expand_more"
                    className={cn(
                      "text-xl transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </span>
              </button>
              {isOpen ? (
                <div className="border-t border-surface-container-low px-6 pt-3 pb-6 text-body-md text-on-surface-variant">
                  {item.answer}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
