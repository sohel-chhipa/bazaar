import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";

function NotFoundPage() {
  return (
    <div className="mx-auto grid min-h-[65vh] max-w-7xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary">
          <SearchX className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight">404</h1>
        <p className="mt-2 text-lg font-medium">Page not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to={PAGE_URLS.HOME}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
