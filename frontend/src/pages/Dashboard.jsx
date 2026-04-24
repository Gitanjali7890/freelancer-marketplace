import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../Services/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/projects/my-projects');
        setProjects(response.data);
        
        const total = response.data.length;
        const open = response.data.filter(p => p.status === 'open').length;
        const inProgress = response.data.filter(p => p.status === 'in-progress').length;
        setStats({ total, open, inProgress });
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Welcome Card */}
      <div className="card mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="text-2xl font-semibold mb-2">Welcome, {user.name}!</h2>
        <p className="opacity-90">Role: {user.role === 'client' ? 'Client' : 'Freelancer'}</p>
        <p className="opacity-90">Email: {user.email}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-500 text-sm">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">Open Projects</h3>
          <p className="text-3xl font-bold text-green-600">{stats.open}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
        </div>
      </div>
      
      {/* Projects List */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">
          {user.role === 'client' ? 'Your Projects' : 'Available Projects'}
        </h3>
        
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;