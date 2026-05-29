export function Newsletter() {
  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Newsletter
        </div>
        <h2 className="mb-3 text-3xl font-semibold sm:text-4xl">Get deals first.</h2>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          Early access to drops, member-only discount codes, and a heads-up before every major sale.
        </p>
        <form
          onSubmit={(event) => event.preventDefault()}
          className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full bg-secondary px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 font-medium text-background transition hover:opacity-90">
            Get Deals
          </button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
