import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Layout from '@/components/layout/Layout';
import PrivateRoute from '@/components/common/PrivateRoute';
import { useRouter } from 'next/router';

const privateRoutes = [
  '/add-idea',
  '/my-ideas',
  '/my-interactions',
  '/profile',
  '/ideas/[id]',
];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isPrivate = privateRoutes.includes(router.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout>
          {isPrivate ? (
            <PrivateRoute>
              <Component {...pageProps} />
            </PrivateRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}
