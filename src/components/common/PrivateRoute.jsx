import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(router.asPath);
      router.replace(`/login?returnUrl=${returnUrl}`);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loading />;
  }

  return children;
}
