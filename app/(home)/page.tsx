import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-2xl font-bold mb-4">Hello World</h1>
      <p>
        You can open{' '}
        <Link href="/getting-started/setup/" className="font-medium underline">
          Getting Started
        </Link>{' '}
        and see the documentation.
      </p>
    </div>
  );
}
