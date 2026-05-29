import { ArrowRight } from "lucide-react";

export function OffersBanner() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-foreground p-10 text-background sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-background/10" />
          <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full border border-background/10" />
          <div className="absolute right-10 top-10 h-20 w-20 rounded-2xl border border-background/15" />

          <div className="relative max-w-2xl">
            <div className="mb-4 text-xs font-medium uppercase tracking-wider opacity-70">
              Exclusive
            </div>
            <h2 className="mb-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Up to 70% off
              <br />
              <span className="opacity-70">on your favorite brands</span>
            </h2>
            <p className="mb-8 max-w-md opacity-70">
              From everyday essentials to premium picks, your wishlist just got a whole lot lighter.
            </p>
            <button className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-medium text-foreground transition hover:opacity-90">
              Explore Offers <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
