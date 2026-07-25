import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/AuthForms';

export default function Login() {
  const { user, login, googleLogin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { returnUrl } = router.query;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const destination = returnUrl && typeof returnUrl === 'string' ? returnUrl : '/';
      router.replace(destination);
    }
  }, [authLoading, user, returnUrl, router]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success('Login successful');
    } catch (err) {
      toast.error(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      Loading...
    </div>
  );
}

if (user) return null;

  return (
    <>
      <Head>
        <title>Login | IdeaVault</title>
      </Head>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-base-200">
        <LoginForm
          onSubmit={handleLogin}
          onGoogle={handleGoogle}
          loading={loading}
        />
      </div>
    </>
  );
}
