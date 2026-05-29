export function AppFooter() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Bazaar Commerce. All rights reserved.</p>
        <p>Built with production-grade architecture and fake-store APIs.</p>
      </div>
    </footer>
  );
}
