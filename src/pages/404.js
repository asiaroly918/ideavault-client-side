import Head from 'next/head';
import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found | IdeaVault</title>
      </Head>

      <section className="min-h-[70vh] flex items-center justify-center bg-base-100 px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 text-error mb-6">
            <FaExclamationTriangle className="w-10 h-10" />
          </div>
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
          <p className="text-base-content/70 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className="btn btn-primary btn-wide">
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
