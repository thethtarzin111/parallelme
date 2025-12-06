# 🌟 ParallelMe - Your Journey to Your Alternate Self

**ParallelMe** is a AI-driven, personalized growth-journey web application that helps users discover and develop their full potential through gamified quests and dynamic storytelling.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Contact](#contact)

  ---
  
## 🎯 Overview

ParallelMe transforms personal growth into an adventure. Instead of generic self-help advice, it creates a personalized "alternate self" – a vision of who you want to become – and guides you through 30 AI-generated quests tailored to your specific fears, aspirations, and inspirations.

As you complete quests, AI generates story snippets that turn your journey into an epic narrative, making self-improvement feel less like a chore and more like a hero's journey.

---

## ✨ Features

### Core Features
- **AI-Powered Persona Generation** - Creates a unique alternate self description using Claude AI
- **Gamified Quest System** - 30 personalized quests across 10 difficulty batches
- **Story Generation** - AI-generated narrative snippets and chapters
- **Progress Tracking** - Stats, streaks, confidence scores, and completion rates
- **Secure Authentication** - JWT-based user authentication
- **Persistent Data** - All progress saved to MongoDB

### User Journey
- **AI-Powered Persona Creation** - Claude AI generates a unique "alternate self" based on your fears, inspirations, and desired traits
- **30 Personalized Quests** - Custom challenges designed specifically for your growth journey
- **Progressive Quest System** - Quests unlock in batches of 3 to maintain momentum without overwhelm
- **Dynamic Storytelling** - AI generates story snippets (50-80 words) after each quest completion
- **Chapter System** - Comprehensive chapters (200-250 words) after every 3 quests
- **Grand Finale** - Epic conclusion after completing all 30 quests
- **Dashboard Analytics** - Track progress with beautiful charts and statistics
- **Engaging Animations** - Typewriter effects, fade-ins, and confetti celebrations
- **Secure Authentication** - JWT-based user authentication system

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Deployed on Vercel**
  
### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Deployed on Railway**

### AI Integration
- **Anthropic Claude API** - Sonnet 4 model
- Powers persona generation, quest creation, and storytelling
  
### DevOps & Deployment
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Cloud database
- **Git** + **GitHub** - Version control

---

## 🚀 Getting Started

### For Testers / Users (Quick Start)

**Just want to try the app? No installation needed!**

**Live Demo:** [https://parallelme.vercel.app/](https://parallelme.vercel.app/)

#### Create New Account
1. Click **"Create One"** on the Login page if you don't have an account yet
2. Fill in your name, email, password and confirm password
3. Start your journey by creating your persona!

#### What to Try:
- ✅ Create your alternate self persona with custom traits and fears
- ✅ Complete your first quest and write a reflection
- ✅ See AI-generated story snippets
- ✅ Check your progress stats
- ✅ Unlock the next batch of quests

**Estimated test time:** 10-15 minutes for core features

If you want to reach the ending and see the surprise, you'll need to go through all 30 quests.
**Estimated test time** for this is around 30+ minutes.

### For Developers (Local Setup)

**Want to run the project locally or contribute?**

#### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Anthropic API key** ([Get one here](https://console.anthropic.com/))

#### Installation Steps

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/parallelme.git
   cd parallelme
```

2. **Install backend dependencies**
```bash
   cd backend
   npm install
```

3. **Install frontend dependencies**
```bash
   cd ../frontend
   npm install
```

4. **Set up environment variables**

   Create `backend/.env`:
```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/parallelme?retryWrites=true&w=majority
   CLAUDE_API_KEY=your_anthropic_api_key_here
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   PORT=5000
```

   Create `frontend/.env`:
```env
   VITE_API_URL=http://localhost:5000/api
```

5. **Run the application**

   **Backend (Terminal 1):**
```bash
   cd backend
   npm run dev
```
   Backend runs on `http://localhost:5000`

   **Frontend (Terminal 2):**
```bash
   cd frontend
   npm run dev
```
   Frontend runs on `http://localhost:5173`

6. **Access the app**
   Open `http://localhost:5173` in your browser


## 🤝 Contributing

Contributions are welcome! If you'd like to improve ParallelMe:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📸 Screenshots

### Registration
<img src="./assets/register-page.png" alt="Registration Page" width="400">

### Login Page
<img src="./assets/login-page.png" alt="Welcome Page" width="400">

### Welcome Page
<img src="./assets/welcome-page.png" alt="Welcome Page" width="400">

### Instructions
<img src="./assets/instruction-page.png" alt="Instruction Page" width="400">

### Persona Creation

<img src="./assets/fears-page.png" alt="User's Fears Page" width="400">
<img src="./assets/inspirations-page.png" alt="User's Inspirations Page" width="400">
<img src="./assets/traits-page.png" alt="User's Traits Page" width="400">
<img src="./assets/persona-page.png" alt="User's Persona Page" width="400">

### Quests
<img src="./assets/quests-page.png" alt="Quests" width="400">
<img src="./assets/reflection-page.png" alt="Reflection Page" width="400">
<img src="./assets/quest-completion-page.png" alt="Quest Completion Page" width="400">

### Dashboard
<img src="./assets/dashboard-page.png" alt="Dashboard" width="400">

### Completed Quests
<img src="./assets/completed-quests-page.png" alt="Completed Quests" width="400">

### Journey
<img src="./assets/journey-page.png" alt="User's Journey" width="400">

---

## 👤 Contact

**Thet Htar Zin**  
- GitHub: [@thethtarzin111](https://github.com/thethtarzin111)
- LinkedIn: [Thet Htar Zin](https://www.linkedin.com/in/thet-htar-zin-2390b3240?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app)

**Project Link:** [https://github.com/yourusername/parallelme](https://github.com/yourusername/parallelme)

---


<p align="center">Made with ❤️ and ☕ by Thet </p>
<p align="center">⭐ Star this repo if you found it helpful!</p>
