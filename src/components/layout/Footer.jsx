import Link from 'next/link';
import { FaLightbulb } from 'react-icons/fa';
import { FaXTwitter, FaGithub, FaLinkedin } from 'react-icons/fa6';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <FaLightbulb className="text-warning" />
              IdeaVault
            </Link>
            <p className="mt-3 text-sm text-base-content/70">
              Share, validate, and refine startup ideas with a community of builders and dreamers.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ideas" className="link link-hover">Explore Ideas</Link></li>
              <li><Link href="/add-idea" className="link link-hover">Add Idea</Link></li>
              <li><Link href="/my-ideas" className="link link-hover">My Ideas</Link></li>
              <li><Link href="/my-interactions" className="link link-hover">My Interactions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ideas?category=Tech" className="link link-hover">Tech</Link></li>
              <li><Link href="/ideas?category=Health" className="link link-hover">Health</Link></li>
              <li><Link href="/ideas?category=AI" className="link link-hover">AI</Link></li>
              <li><Link href="/ideas?category=Education" className="link link-hover">Education</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact</h4>
            <p className="text-sm text-base-content/70">support@ideavault.dev</p>
            <p className="text-sm text-base-content/70">123 Innovation Lane, Tech City</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="btn btn-circle btn-sm btn-ghost" aria-label="X">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost" aria-label="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost" aria-label="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-base-300 mt-10 pt-6 text-center text-sm text-base-content/60">
          © {year} IdeaVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
