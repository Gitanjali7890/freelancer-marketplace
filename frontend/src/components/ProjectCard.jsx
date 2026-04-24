import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-green-600 font-bold text-lg">${project.budget}</span>
        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>Posted by: {project.clientId?.name}</p>
        <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
      </div>
      
      <Link
        to={`/projects/${project._id}`}
        className="btn-primary inline-block text-center w-full"
      >
        View Details
      </Link>
    </div>
  );
};

export default ProjectCard;