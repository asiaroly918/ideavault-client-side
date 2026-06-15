import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '0.75rem',
          },
        }}
      />
    </div>
  );
}
