<div align="center">

# 📚 Bookmark & Resource Manager

### Your personal knowledge command center, built for students and developers 🧠✨

*Capture it. Curate it. Conquer it. Stop losing great links to the void.*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-black?style=for-the-badge)](https://resource-and-bookmark-manager.vercel.app)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2-22b5bf)](https://recharts.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**🔒 Zero backend · 🙅 Zero sign-ups · ⚡ Zero friction** — just `npm install` and go.
Everything runs in your browser, and your data never leaves your device.

</div>

---

## 🧭 Table of Contents

- [🎯 The Problem](#-the-problem)
- [💡 The Solution](#-the-solution)
- [✨ Feature Highlights](#-feature-highlights)
- [📸 Screenshots](#-screenshots)
- [⚡ Quick Start](#-quick-start)
- [🛠️ Tech Stack](#️-tech-stack)
- [🗂️ Project Architecture](#️-project-architecture)
- [🔄 Data Flow](#-data-flow)
- [🪄 Smart Categorization Engine](#-smart-categorization-engine)
- [🔐 Privacy, Storage & Backup](#-privacy-storage--backup)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🎯 The Problem

We all hoard links. Tutorials in browser bookmarks, articles in chat threads, docs buried in notes apps, and when the moment of need arrives, none of it can be found. Saved knowledge that can't be retrieved is just digital clutter.

## 💡 The Solution

**Bookmark & Resource Manager** transforms that scattered pile into a **searchable, organized, progress-aware library**. Every resource can be categorized, tagged, annotated and tracked from *"To Read"* to *"Completed"*, so what you save actually gets read, not forgotten.

---

## ✨ Feature Highlights

### 📥 Capture & Curate
- ➕ Add, edit and delete resources with built-in **validation** and **duplicate-URL detection**
- 🔎 **Auto-detection** of domain, favicon, title and resource type straight from the URL
- 🪄 **Smart Categorize**: a local keyword engine proposes a category, type and tags for you
- 🗃️ Categories, tags and **collections**, each with per-collection progress stats
- 📝 Personal notes attached to every resource

### 🔍 Discover & Navigate
- 🧲 Search across title, URL, description, category, tags, notes and type
- 🎚️ Powerful filters plus **7 sorting options**
- 🔀 Switch between **grid** and **list** views, with a details popup
- ⭐ Dedicated **Favorites** page and 📦 **Archived** section

### 📈 Track & Reflect
- 🚦 Status workflow: **To Read → In Progress → Completed**
- 🏠 Dashboard with live stats, *recently added*, *recently viewed* and **"You May Also Like"**
- 📊 Analytics suite: category donut, resource-type bar chart, weekly activity line chart and status donut

### 🧰 Quality of Life
- 📤 **JSON / CSV export** and 📥 **JSON import**
- 🌗 Light and dark themes
- 📱 Fully responsive, with a bottom navigation bar on mobile

---

## 📸 Screenshots

### 🏠 Main Dashboard

| ☀️ Light Mode | 🌙 Dark Mode |
| :---: | :---: |
| ![Dashboard Light](screenshot/dashboard-light.png) | ![Dashboard Dark](screenshot/dashboard-dark.png) |

### 📊 Analytics Dashboard

| ☀️ Light Mode | 🌙 Dark Mode |
| :---: | :---: |
| ![Analytics Light](screenshot/analytics-light.png) | ![Analytics Dark](screenshot/analytics-dark.png) |

---

## ⚡ Quick Start

**Prerequisite:** [Node.js 18+](https://nodejs.org/en/download)

```bash
# 1️⃣ Clone the repository
git clone https://github.com/Interestseller/Resource-and-Bookmark-Manager.git
cd Resource-and-Bookmark-Manager

# 2️⃣ Install dependencies
npm install

# 3️⃣ Launch the dev server
npm run dev
```

Then open **<http://localhost:5173>** 🎉

> 🪟 **Windows shortcut:** double-click `install.bat` to install, then `run.bat` to launch.

### 📜 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Produces an optimized production build in `/dist` |
| `npm run preview` | Serves the production build locally for a final check |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| 🎨 UI | React 18 |
| ⚙️ Build tool | Vite |
| 🧭 Routing | React Router (`HashRouter`) |
| 💅 Styling | Tailwind CSS v4 |
| 📉 Charts | Recharts |
| 🔣 Icons | Lucide React |
| 💾 Persistence | Browser `localStorage` |

---

## 🗂️ Project Architecture

```text
src/
├── components/   Layout, ResourceCard, ResourceList, ResourceForm, Modal,
│                 ConfirmDialog, EmptyState, StatsCard, TagBadge, ResourceChart
├── pages/        Dashboard, Resources (also Favorites), Collections,
│                 Analytics, SettingsPage
├── hooks/        useLibrary.jsx   → all state + actions (React Context)
├── services/     metadataService.js, smartCategorize.js
│                 (designed to be swapped for real APIs later)
├── utils/        constants, resource (data shape), storage (localStorage),
│                 stats (math)
└── data/         sampleData.js    → demo data
```

**Design philosophy:** a clean separation of concerns. UI components stay presentational, `useLibrary` owns state and actions, and `services/` isolates logic that can later be upgraded to real APIs without touching the interface.

---

## 🔄 Data Flow

`LibraryProvider` (in `useLibrary.jsx`) holds `resources` and `collections`. Pages consume them through the `useLibrary()` hook and trigger actions such as `saveResource`. Every mutation updates state, re-renders the UI and charts, and is auto-persisted to `localStorage`.

```text
Page / Component ──► useLibrary() action ──► state update ──► UI + charts re-render
                                                  │
                                                  └──► storage.js ──► localStorage
```

---

## 🪄 Smart Categorization Engine

`services/smartCategorize.js` scores every category by how many of its keywords surface in a resource's title, URL, description and notes. It then:

1. 🥇 Selects the highest-scoring category
2. 🔖 Infers the resource type from the URL and wording
3. 🏷️ Recommends relevant tags

The function is `async` by design, so it can be upgraded to an **LLM-powered API call** with zero changes to the form that consumes it.

---

## 🔐 Privacy, Storage & Backup

- 🛡️ All data lives in your browser's `localStorage` under the key `rm_data_v1`. **Nothing is ever sent to a server.**
- 🧱 `utils/storage.js` is the **only** file that touches `localStorage`. Migrating to a database means replacing just this one module with API calls.
- 🩹 If stored data is ever corrupted, the app gracefully falls back to demo data.
- ⚠️ Clearing browser data erases your library, so **export (JSON/CSV) from Settings regularly** and use JSON import to restore.

---

## 🗺️ Roadmap

**🔧 Platform upgrades**
- [ ] 🌐 Backend API and authentication (Supabase or Express + PostgreSQL)
- [ ] 🕸️ Server-side page-title fetching
- [ ] 📑 CSV import
- [ ] 🧩 Browser extension for one-click saving
- [ ] 🧪 Automated tests
- [ ] 🏷️ Tag management page

**🤖 AI-powered intelligence**
- [ ] 📝 Resource summarizer
- [ ] 🏷️ AI tag generator
- [ ] 🧬 Semantic duplicate detection
- [ ] 🎯 Recommendation engine
- [ ] 🛤️ Personalized study roadmaps
- [ ] 💬 Natural-language search

---

## 🤝 Contributing

Contributions, ideas and feedback are warmly welcome! 🙌

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/your-feature`
3. 💾 Commit with clear, descriptive messages
4. 🚀 Push and open a pull request

---

## 📄 License

Released under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👨‍💻 Author

**Suryansh Asati**

[![GitHub](https://img.shields.io/badge/GitHub-Interestseller-181717?logo=github&logoColor=white)](https://github.com/Interestseller)

<div align="center">

⭐ **If this project helped you, consider giving it a star.** It genuinely motivates further building. ⭐

*Crafted with curiosity and caffeine by Suryansh Asati* ☕💙

</div>