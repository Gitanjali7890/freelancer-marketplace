# 🚀 Freelancer Marketplace

A full-stack web application where clients can post projects and freelancers can bid on them.

## ✨ Features

### For Clients
- Create and manage projects
- View bids from freelancers
- Accept/Reject bids
- Search and filter freelancers by skills, rate, and rating
- Mark projects as completed

### For Freelancers
- Browse available projects
- Place bids with cover letter
- Track bid status (Pending/Accepted/Rejected)
- Create detailed profile with bio, experience, skills, and hourly rate
- Receive ratings and reviews

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Environment Variables

Create `.env` file in backend folder:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelancer_marketplace
JWT_SECRET=your_secret_key
\`\`\`

## 👥 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Client | john@client.com | 123456 |
| Freelancer | aroragitanjali09@gmail.com | Gitanjali@123 |

## 🎯 Key Features

- **Authentication**: JWT-based authentication with role-based access
- **Project Management**: CRUD operations for projects
- **Bidding System**: Freelancers can bid, clients can accept/reject
- **Profile Management**: Freelancers can showcase skills and experience
- **Search & Filters**: Advanced search for freelancers
- **Responsive Design**: Works on all devices with dark theme

## 📁 Project Structure

\`\`\`
freelancer-marketplace/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── index.html
\`\`\`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project |
| POST | /api/bids | Place a bid |
| GET | /api/freelancers | Get freelancers |

## 📸 Screenshots

[Add screenshots of your application here]

## 👨‍💻 Author

Your Name

## 📄 License

MIT
