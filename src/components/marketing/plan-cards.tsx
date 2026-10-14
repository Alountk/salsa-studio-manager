import { Card, Icon, LinkButton } from "@/components/ui";
import { PLANS, euros } from "@/lib/billing";
import { cn } from "@/lib/cn";

/**
 * Design 3, screen 01 — the three plan cards (S1).
 *
 * Card treatment follows DESIGN.md (border, 14px radius, p-6) over the
 * export's borderless p-8; the export still owns copy, structure and spacing.
 * Their peach `surface-container-high` maps to our `primary-container`, and
 * text on peach uses `on-primary-container` for AA contrast — their theme's
 * dark rust `primary` has no exact token here.
 */

/** `**bold**` segments in feature copy become `<strong>`, as in the export. */
function featureNodes(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part,
  );
}

/** Route mapping IA call 3: only the bono purchase starts the checkout. */
function planHref(id: (typeof PLANS)[number]["id"]) {
  return id === "bono" ? "/tarifas/pago" : "/login";
}

export function PlanCards() {
  return (
    <section className="mb-24 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-8">
      {PLANS.map((plan) => {
        const featured = plan.badge !== null;
        return (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col justify-between",
              featured && "ring-2 ring-primary",
            )}
          >
            {featured ? (
              <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-pill bg-primary-container px-4 py-1 shadow-sm">
                <Icon
                  name="local_fire_department"
                  filled
                  className="text-sm text-on-primary-container"
                />
                <span className="text-label uppercase text-on-primary-container">
                  {plan.badge}
                </span>
              </span>
            ) : null}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-headline-md text-on-surface">
                  {plan.name}
                </h3>
                <span
                  className={cn(
                    "rounded-md p-2",
                    featured
                      ? "bg-primary-container text-primary"
                      : "bg-surface-container text-on-surface-variant",
                  )}
                >
                  <Icon name={plan.icon} className="text-xl" />
                </span>
              </div>

              <p className="mb-6 min-h-[40px] text-body-sm text-on-surface-variant">
                {plan.description}
              </p>

              <div
                className={cn(
                  "mb-6 rounded-md p-4 pb-6",
                  featured
                    ? "bg-primary-container/60"
                    : "bg-primary-container/40",
                )}
              >
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-metric tabular-figures text-on-surface">
                    {euros(plan.priceCents)}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {plan.unit}
                  </span>
                </div>
                {plan.subnotes.length === 1 ? (
                  <span className="mt-1 block text-label tracking-normal text-on-surface-variant">
                    {plan.subnotes[0]}
                  </span>
                ) : (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-body-sm font-medium text-on-surface">
                      {plan.subnotes[0]}
                    </span>
                    {plan.subnotes.slice(1).map((pill) => (
                      <span
                        key={pill}
                        className="rounded-pill bg-secondary-container px-2 py-0.5 text-label text-on-secondary-container"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <ul className="mb-8 space-y-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-body-md text-on-surface"
                  >
                    <Icon
                      name="check_circle"
                      className="mt-0.5 shrink-0 text-xl text-secondary"
                    />
                    <span>{featureNodes(feature)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <LinkButton
              href={planHref(plan.id)}
              variant={plan.ctaVariant}
              fullWidth
            >
              {plan.cta}
            </LinkButton>
          </Card>
        );
      })}
    </section>
  );
}
