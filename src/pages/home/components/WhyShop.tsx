import { BadgeDollarSign, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

import type { Feature } from "@/shared/types/catalog.types";

const featureIconMap: Record<string, LucideIcon> = {
  "Fast Delivery": Truck,
  "Easy Returns": RotateCcw,
  "Secure Payments": ShieldCheck,
  "Best Prices": BadgeDollarSign,
};

interface WhyShopProps {
  features: Feature[];
}

export function WhyShop({ features }: WhyShopProps) {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Why Bazaar
          </div>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Built for a calmer shopping experience.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = featureIconMap[feature.title] ?? Truck;

            return (
              <article
                key={feature.id}
                className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-foreground"
              >
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-medium">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
