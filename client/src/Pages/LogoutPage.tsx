import { useEffect } from 'react';
import { useAuthContext } from '../store/authContext';
import { Link } from 'react-router-dom';

export default function LogoutPage() {
  const { logout } = useAuthContext();

  useEffect(() => {
    logout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>
      <div><h1>Logging out</h1></div>
      <div><Link to="/login">Login</Link></div>
  </div>;
}
