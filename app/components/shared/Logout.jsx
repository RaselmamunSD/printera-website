'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Logout() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}
