# ParallelMe - Frontend

React-based frontend for ParallelMe, a personalized confidence-building application.

## 🛠️ Tech Stack

- **React** (with Vite)
- **React Router** - Navigation
- **Axios** - API requests
- **CSS** - Styling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)

### Installation
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

For production (Vercel), set:
```env
VITE_API_URL=https://parallelme.up.railway.app/api
```

### Development
```bash
npm run dev
```

App runs on `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## 🔗 Related

- **Backend Repository:** [../backend](../backend)
- **Live Demo:** [https://parallelme.vercel.app/](https://parallelme.vercel.app/)

Made with ⚛️ React + ⚡ Vite
