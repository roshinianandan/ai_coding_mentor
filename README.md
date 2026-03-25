# ⚡ Intelligent Coding Mentor — React + Bootstrap

A smart AI-powered coding mentor built with **Create React App**, **Bootstrap 5**, and **Monaco Editor**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AnalysisPanel.js     # AI result panel with progressive hints
│   ├── AppShell.js          # Layout wrapper (sidebar + main)
│   ├── ConceptBar.js        # Mastery progress bar
│   ├── DifficultyBadge.js   # Easy / Medium / Hard badge
│   ├── Sidebar.js           # Navigation sidebar
│   └── Toast.js             # Notification toast
├── context/
│   └── AppContext.js        # Global state (user, knowledge, submissions)
├── pages/
│   ├── Dashboard.js         # Mastery overview + recommendations
│   ├── CodeEditorPage.js    # Monaco editor + analysis panel
│   ├── LoginPage.js         # Auth entry screen
│   └── ProfilePage.js       # User profile + history
├── utils/
│   ├── mockAnalysis.js      # Simulated AI code analysis engine + starter code
│   └── problems.js          # Recommended problems data
├── App.js
├── index.js
└── index.css                # Design tokens + Bootstrap dark overrides
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Login | Mock auth — any email/password works |
| 📊 Dashboard | Mastery bars + Recharts bar chart + recommendations |
| ⌨️ Code Editor | Monaco Editor with Python / Java / C++ |
| 🔍 AI Analysis | Simulated mistake detection with explanation |
| 💡 Progressive Hints | Reveal hints one at a time |
| 📈 Knowledge Model | Scores update +3% on every submission |
| 👤 Profile | Stats, submission history, mastery breakdown |

---

## 🛠 Tech Stack

- **React 18** (Create React App)
- **Bootstrap 5.3** + **Bootstrap Icons 1.11**
- **@monaco-editor/react** — VS Code-grade editor in the browser
- **Recharts** — Score visualization charts
- **React Context API** — Global state management

---

## 📦 Build for Production

```bash
npm run build
# Output in: build/
```

---

## 🎨 Design

Dark GitHub-inspired theme using CSS custom properties layered on top of Bootstrap.
Primary font: `Syne` (UI) + `JetBrains Mono` (code).
Primary accent: `#58a6ff`.
