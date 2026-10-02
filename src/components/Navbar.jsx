import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="brand">College Management System</div>
      <nav>
        {user ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/courses">Courses</Link>
            <span style={{ color: '#93c5fd', fontSize: '0.9rem' }}>{user.email}</span>
            <button className="link" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
