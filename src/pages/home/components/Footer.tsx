import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { FOOTER_COLUMNS, SITE_META } from "@/shared/constants/site.constants";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <a href="#" className="mb-4 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
                Z
              </div>
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {SITE_META.appName}
              </span>
            </a>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              A calmer way to shop online. Thousands of products, fair prices, and a smooth
              experience end-to-end.
            </p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <a
                  key={`${Icon.displayName ?? "social"}-${index}`}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition hover:bg-primary/10"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-medium">{column.title}</h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {new Date().getFullYear()} {SITE_META.appName}. All rights reserved.
          </div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-primary">
              Privacy
            </a>
            <a href="#" className="transition hover:text-primary">
              Terms
            </a>
            <a href="#" className="transition hover:text-primary">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
