import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../Services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { showSuccess, showError } from '../components/Toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfile(response.data);
      setFormData({
        bio: response.data.bio || '',
        skills: response.data.skills || []
      });
    } catch (error) {
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/user/${user.id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      showSuccess('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Name</h3>
          <p>{profile.name}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Email</h3>
          <p>{profile.email}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Role</h3>
          <p className="capitalize">{profile.role}</p>
        </div>
        
        {profile.role === 'freelancer' && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">{profile.rating.toFixed(1)}</span>
                <span className="text-gray-500">({profile.totalReviews} reviews)</span>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Total Earnings</h3>
              <p className="text-2xl font-bold text-green-600">${profile.earnings}</p>
            </div>
          </>
        )}
        
        {editing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows="4"
                className="input-field"
                placeholder="Tell freelancers about yourself..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add a skill (e.g., React, Python)"
                />
                <button type="button" onClick={addSkill} className="btn-secondary">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">Save Changes</button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            {profile.bio && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Bio</h3>
                <p>{profile.bio}</p>
              </div>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{review.fromUserId?.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;