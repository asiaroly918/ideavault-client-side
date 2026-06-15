import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { FaLightbulb, FaBars, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Ideas' },
];

const privateLinks = [
  { href: '/add-idea', label: 'Add Idea' },
  { href: '/my-ideas', label: 'My Ideas' },
  { href: '/my-interactions', label: 'My Interactions' },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { theme } = useTheme();

  const isActive = (href) => router.pathname === href;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="navbar bg-base-100/90 backdrop-blur border-b border-base-200 sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost normal-case text-xl gap-2">
          <FaLightbulb className="text-warning" />
          <span>IdeaVault</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {publicLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive(link.href) ? 'active font-semibold' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user &&
            privateLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive(link.href) ? 'active font-semibold' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeToggle />

        {!loading && !user && (
          <div className="hidden sm:flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}

        {!loading && user && (
          <div className="dropdown dropdown-end hidden sm:block">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-9 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                <img
                  src={user.photoURL || 'https://i.ibb.co/5L73mvX/avatar.png'}
                  alt={user.displayName || 'User'}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
            >
              <li className="px-3 py-2 text-sm font-semibold text-base-content/80">
                {user.displayName || 'User'}
              </li>
              <li>
                <Link href="/profile">
                  <FaCog className="w-4 h-4" /> Profile Management
                </Link>
              </li>
              <li>
                <Link href="/my-ideas">
                  <FaLightbulb className="w-4 h-4" /> My Ideas
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  <FaSignOutAlt className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        <div className="dropdown dropdown-end sm:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <FaBars className="w-5 h-5" />
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
          >
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
            {user &&
              privateLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            {!user ? (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/profile">Profile Management</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
