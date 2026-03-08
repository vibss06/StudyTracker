<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Sarvam_AI-Chat-FF6B6B?style=flat-square" alt="Sarvam AI" />
</p>

# 📚 StudyTracker

> A premium, dark-themed study management app that helps students plan, focus, and track their academic progress — powered by AI.

StudyTracker is a full-featured study companion built with React 19 and Supabase. It combines beautiful glassmorphic UI with powerful tools like a Pomodoro timer, daily routine planner, progress analytics, goal tracking, and an AI-powered study assistant.

---

## ✨ Features

### 🏠 Dashboard
- Personalized greeting with daily goal progress
- Current streak tracker with fire animation
- Weekly hours, total sessions, and pending tasks at a glance
- Today's session log with subject color coding

### ⏱️ Focus Timer (Pomodoro)
- Pomodoro, Short Break, and Long Break modes
- Subject selection for session tracking
- Circular progress indicator and large countdown display
- Auto-saves sessions with optional notes on completion
- Browser notifications when timer completes

### 📖 Subjects
- Add and manage study subjects with custom color coding
- Track weekly study goals per subject
- View total hours studied for each subject

### 📅 Planner
- Visual study session planner
- Schedule and organize upcoming study sessions

### 🗓️ Daily Routine
- Block your entire day from 6 AM to 11 PM
- Visual timeline for focused study sessions
- Track how you spend your day

### 📊 Progress & Analytics
- **Bar Chart** — Study hours by subject (past 7 days)
- **Line Chart** — Daily study trend (past 14 days)
- **Activity Heatmap** — 30-day GitHub-style activity grid
- All powered by Recharts with dark-themed styling

### 🎯 Goals
- Set academic goals with urgency levels
- Track due dates and completion status
- Maintain daily streaks for consistency

### 🤖 AI Study Assistant
- Floating chat sidebar available on every page
- Powered by **Sarvam AI** for intelligent responses
- Get help with concepts, study tips, and problem solving
- Conversation context maintained across messages
- Suggestion chips for quick prompts

### 🌍 Landing Page
- Scroll-driven 3D interactive globe animation
- Parallax sections showcasing features
- Scroll progress indicator and side navigation dots

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router 7 |
| **Bundler** | Vite 7 |
| **Styling** | Tailwind CSS 4, tw-animate-css |
| **State** | Zustand |
| **Backend** | Supabase (Auth + PostgreSQL) |
| **Charts** | Recharts |
| **AI Chat** | Sarvam AI API |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/studytracker.git
cd studytracker

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SARVAM_API_KEY=your_sarvam_api_key
```

### Supabase Setup

Your Supabase project needs the following tables:

- **profiles** — User profile data (name, avatar_url, daily_goal_hrs)
- **subjects** — Study subjects (name, color, user_id)
- **sessions** — Study sessions (subject_id, user_id, start_time, end_time, duration_mins, date, notes)
- **goals** — Academic goals (title, due_date, urgency, completed, user_id)
- **streaks** — Daily study streaks
- **routines** — Daily routine entries

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx      # Main app shell
│   │   ├── Sidebar.jsx        # Desktop navigation
│   │   ├── BottomNav.jsx      # Mobile bottom navigation
│   │   ├── ChatPanel.jsx      # AI chat sidebar
│   │   └── ProtectedRoute.jsx # Auth guard
│   └── ui/
│       ├── landing-page.jsx   # Landing page with 3D globe
│       ├── globe.jsx          # Animated globe component
│       └── animated-generate-button.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Timer.jsx
│   ├── Planner.jsx
│   ├── Subjects.jsx
│   ├── Progress.jsx
│   ├── Goals.jsx
│   ├── DailyRoutine.jsx
│   ├── Settings.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useDashboardData.js
│   ├── useSubjects.js
│   └── useRoutine.js
├── lib/
│   ├── supabaseClient.js      # Supabase connection
│   ├── sarvamClient.js        # Sarvam AI chat API
│   └── utils.js
├── store/
│   └── useAppStore.js         # Zustand global state
├── App.jsx
├── main.jsx
└── index.css
```

---

## 📸 Screenshots

> Add screenshots of your app here after deploying!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Built with ❤️ for students everywhere</b>
</p>
