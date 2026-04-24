import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get('/bids/my-bids');
        setBids(response.data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Bids</h1>
      
      {bids.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">You haven't placed any bids yet.</p>
          <Link to="/projects" className="btn-primary inline-block mt-4">Browse Projects</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map(bid => (
            <div key={bid._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/projects/${bid.projectId._id}`} className="text-xl font-semibold text-blue-600 hover:underline">
                    {bid.projectId.title}
                  </Link>
                  <p className="text-gray-600 mt-1">{bid.coverLetter}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-green-600 font-bold">${bid.amount}</span>
                    <span className="text-gray-500">Est. {bid.estimatedDays} days</span>
                    <span className="text-gray-500">Budget: ${bid.projectId.budget}</span>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded text-sm ${
                    bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bid.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;