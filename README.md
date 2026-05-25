# InternLink 🎓

> A web platform helping students find internships & scholarships, form teams, and build their portfolio.

## Features
- Student registration, profile, CV upload
- Browse & apply for internships and scholarships
- Team formation (3–4 members with complementary skills)
- Team applications for real-world company problems
- Project portfolio uploads
- Peer review & performance tracking
- Leaderboard
- Admin dashboard for managing listings & applications

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| File Storage | Cloudinary |

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Install
```bash
git clone https://github.com/your-username/internlink.git
cd internlink
npm install
```

### Environment Variables
Create a `.env` file at the root:
```
PORT=5000
DB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Run
```bash
npm run dev     # development (nodemon)
npm start       # production
```

Open `frontend/index.html` in your browser or serve with Live Server.

## Team
- Person A — Backend
- Person B — Frontend
- Person C — Full stack / QA
