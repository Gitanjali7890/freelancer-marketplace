const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const bidRoutes = require('./routes/bids');
const reviewRoutes = require('./routes/reviews');
const freelancerRoutes = require('./routes/freelancers');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/freelancers', freelancerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Freelancer Marketplace API is running' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer_marketplace')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
