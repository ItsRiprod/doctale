import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

export default function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <p className="font-mono text-sm text-fd-muted-foreground">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-md text-fd-muted-foreground">
          This page doesn&apos;t exist or has moved. Try the search, or start from the setup guide.
        </p>
        <div className="flex gap-3">
          <Link href="/" className="rounded-lg border border-fd-border px-4 py-2 text-sm font-medium hover:bg-fd-accent">
            Home
          </Link>
          <Link href="/getting-started/setup/" className="rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground hover:opacity-90">
            Getting started
          </Link>
        </div>
      </main>
    </HomeLayout>
  );
}
