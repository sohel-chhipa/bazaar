import { ArrowRight, Play, Plus } from "lucide-react";

import type { Feature, Sale } from "@/shared/types/catalog.types";

interface EditorialCommerceLayoutProps {
  sales: Sale[];
  features: Feature[];
}

const metricValues = ["12+", "80+", "3K+"];
const metricLabels = ["Years of service", "Team members", "Happy clients"];

export function EditorialCommerceLayout({ sales, features }: EditorialCommerceLayoutProps) {
  const heroSales = sales.slice(0, 2);

  return (
    <section id="trending" className="border-b border-border bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-5 rounded-[2rem] border border-border/70 bg-subtle p-4 sm:space-y-6 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
            <article className="rounded-3xl bg-white p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                About
              </p>
              <h3 className="mt-3 max-w-sm text-4xl font-semibold leading-[1.05] tracking-tight">
                Empowering modern shoppers from day one
              </h3>
              <p className="mt-4 max-w-md text-sm text-muted-foreground">
                We create intuitive shopping journeys that blend inspiration, speed, and trust into
                every interaction.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Start today <ArrowRight className="h-4 w-4" />
              </button>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroSales.map((sale) => (
                <article
                  key={sale.id}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card"
                >
                  <img
                    src={sale.image}
                    alt={sale.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/40 to-black/18" />
                  <div className="relative flex min-h-[260px] flex-col justify-between p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                      {sale.tag}
                    </p>
                    <div>
                      <h4 className="text-lg font-semibold leading-tight text-white">
                        {sale.title}
                      </h4>
                      <p className="mt-1 text-xs text-white/80">{sale.discount}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <article className="rounded-3xl bg-white p-5 sm:p-6">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Mission
            </p>
            <h3 className="mx-auto mt-2 max-w-4xl text-center text-2xl font-semibold leading-tight sm:text-4xl">
              We are a team of vision-led builders crafting exceptional commerce experiences that
              connect creativity with conversion.
            </h3>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.5fr_1fr]">
              <div className="relative overflow-hidden rounded-2xl bg-background">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1300&q=80"
                  alt="Featured product story"
                  className="h-full min-h-[190px] w-full object-cover"
                />
                <button className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-primary">
                  <Play className="h-5 w-5" />
                </button>
              </div>
              <div className="rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Founder note
                </p>
                <p className="mt-2 text-2xl font-semibold">Ryan Said</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Every product we launch is filtered through design quality, practicality, and a
                  better checkout experience.
                </p>
              </div>
            </div>
          </article>

          <div className="space-y-3">
            {features.slice(0, 3).map((feature, index) => (
              <article
                key={feature.id}
                className="grid items-center gap-3 rounded-2xl border border-border bg-white px-4 py-4 sm:grid-cols-[1fr_auto] sm:px-6"
              >
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="flex items-end gap-2 sm:block sm:text-right">
                  <div className="text-3xl font-semibold leading-none">
                    {metricValues[index] ?? "10+"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metricLabels[index] ?? "Milestones"}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <article className="rounded-3xl bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Studio
              </p>
              <h3 className="mt-3 max-w-sm text-4xl font-semibold leading-[1.05] tracking-tight">
                We specialize in high-quality collections that blend trend and utility.
              </h3>
              <button className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary">
                View catalog
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
            <article className="relative overflow-hidden rounded-3xl border border-border bg-card">
              <img
                src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=80"
                alt="Collection preview"
                className="h-full min-h-[280px] w-full object-cover"
              />
              <div className="absolute bottom-4 right-4 rounded-2xl border border-border bg-white/85 p-3 text-foreground backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  Designing in motion
                </p>
                <p className="mt-1 text-sm font-semibold text-primary">Drop 02 live this week</p>
              </div>
            </article>
          </div>

          <article className="relative overflow-hidden rounded-3xl border border-border bg-card text-foreground">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1800&q=80"
              alt="Night campaign"
              className="h-full min-h-[260px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/48 to-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">
                Digital products, immersive campaigns, and serious conversion focus.
              </h3>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                Start today
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
