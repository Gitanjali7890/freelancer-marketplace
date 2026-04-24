import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../Services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showError, showSuccess } from '../components/Toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    coverLetter: '',
    estimatedDays: ''
  });

  useEffect(() => {
    fetchProjectDetails();
    if (user?.role === 'client') {
      fetchBids();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      showError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/project/${id}`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bids', {
        projectId: id,
        ...bidData,
        amount: Number(bidData.amount),
        estimatedDays: Number(bidData.estimatedDays)
      });
      showSuccess('Bid placed successfully!');
      setShowBidForm(false);
      fetchBids();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleBidAction = async (bidId, status) => {
    try {
      await api.patch(`/bids/${bidId}`, { status });
      showSuccess(`Bid ${status} successfully`);
      fetchBids();
      fetchProjectDetails();
    } catch (error) {
      showError('Failed to update bid');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return <div className="text-center py-8">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>Budget: <span className="font-bold text-green-600">${project.budget}</span></span>
              <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              <span>Posted by: {project.clientId?.name}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded text-sm ${
            project.status === 'open' ? 'bg-green-100 text-green-800' :
            project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Bid Section */}
      {user?.role === 'freelancer' && project.status === 'open' && !showBidForm && (
        <div className="card mb-6">
          <button
            onClick={() => setShowBidForm(true)}
            className="btn-primary w-full"
          >
            Place a Bid
          </button>
        </div>
      )}

      {showBidForm && (
        <div className="card mb-6">
          <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
          <form onSubmit={handleBidSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Bid Amount ($)</label>
              <input
                type="number"
                required
                value={bidData.amount}
                onChange={(e) => setBidData({...bidData, amount: e.target.value})}
                className="input-field"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Estimated Days</label>
              <input
                type="number"
                required
                value={bidData.estimatedDays}
                onChange={(e) => setBidData({...bidData, estimatedDays: e.target.value})}
                className="input-field"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Cover Letter</label>
              <textarea
                required
                rows="4"
                value={bidData.coverLetter}
                onChange={(e) => setBidData({...bidData, coverLetter: e.target.value})}
                className="input-field"
                placeholder="Explain why you're the best fit for this project..."
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary flex-1">Submit Bid</button>
              <button type="button" onClick={() => setShowBidForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Bids List for Client */}
      {user?.role === 'client' && project.status === 'open' && bids.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Bids ({bids.length})</h3>
          <div className="space-y-4">
            {bids.map(bid => (
              <div key={bid._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{bid.freelancerId?.name}</p>
                    <p className="text-green-600 font-bold">${bid.amount}</p>
                    <p className="text-sm text-gray-500">Est. {bid.estimatedDays} days</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBidAction(bid._id, 'accepted')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleBidAction(bid._id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{bid.coverLetter}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;