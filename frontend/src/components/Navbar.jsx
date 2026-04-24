import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Freelancer Marketplace
          </Link>
          
          <div className="flex space-x-4 items-center">
            <Link to="/projects" className="hover:text-blue-200">Projects</Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                {user.role === 'client' && (
                  <Link to="/create-project" className="hover:text-blue-200">Post Project</Link>
                )}
                {user.role === 'freelancer' && (
                  <Link to="/my-bids" className="hover:text-blue-200">My Bids</Link>
                )}
                <Link to="/profile" className="hover:text-blue-200">Profile</Link>
                <button onClick={handleLogout} className="hover:text-blue-200">
                  Logout ({user.name})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="hover:text-blue-200">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;