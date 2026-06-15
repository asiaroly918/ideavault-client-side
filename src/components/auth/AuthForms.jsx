import { useState } from 'react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export function SocialLogin({ onGoogleClick, loading }) {
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      disabled={loading}
      className="btn btn-outline w-full gap-2"
    >
      <FcGoogle className="w-5 h-5" />
      Continue with Google
    </button>
  );
}

export function LoginForm({ onSubmit, onGoogle, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl justify-center mb-2">Welcome Back</h2>
        <p className="text-center text-base-content/70 text-sm mb-6">
          Log in to share ideas, comment, and build your startup profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
              <Link href="#" className="label-text-alt link link-primary">
                Forgot password?
              </Link>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Login'}
          </button>
        </form>

        <div className="divider text-sm text-base-content/50">OR</div>
        <SocialLogin onGoogleClick={onGoogle} loading={loading} />

        <p className="text-center text-sm mt-4">
          New here?{' '}
          <Link href="/register" className="link link-primary font-semibold">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export function RegisterForm({ onSubmit, onGoogle, loading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (value) => {
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    onSubmit(email, password, name, photoURL);
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl justify-center mb-2">Create Account</h2>
        <p className="text-center text-base-content/70 text-sm mb-6">
          Join IdeaVault and start sharing startup ideas today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Photo URL</span>
            </label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-bordered w-full"
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Min 6 chars, uppercase & lowercase
              </span>
            </label>
          </div>

          {error && (
            <div className="alert alert-error alert-sm text-sm py-2">{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Register'}
          </button>
        </form>

        <div className="divider text-sm text-base-content/50">OR</div>
        <SocialLogin onGoogleClick={onGoogle} loading={loading} />

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link href="/login" className="link link-primary font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
