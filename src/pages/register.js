import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { RegisterForm } from '@/components/auth/AuthForms';

export default function Register() {
  const { user, register, googleLogin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [authLoading, user, router]);

  const handleRegister = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      await register(email, password, name, photoURL);
      toast.success('Account created successfully');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
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

  if (authLoading || user) return null;

  return (
    <>
      <Head>
        <title>Register | IdeaVault</title>
      </Head>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-base-200">
        <RegisterForm
          onSubmit={handleRegister}
          onGoogle={handleGoogle}
          loading={loading}
        />
      </div>
    </>
  );
}
