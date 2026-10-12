# 📚 Bookmark & Resource Manager

> A personal knowledge library for students and developers. Save links, organize them, track what you've read, and actually find them again.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

**No backend. No account. No setup beyond `npm install`.** Everything runs in your browser and your data stays on your device.

<!-- Add your deployed link here if you have one -->
<!-- **[Live Demo →](https://your-demo-url)** -->

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Features](#features)
- [Screenshots](#screenshots)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Smart Categorization](#smart-categorization)
- [Data Storage & Backup](#data-storage--backup)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Most of us save hundreds of links across browser bookmarks, chats and notes, then can't find any of them when needed. This app turns that pile into a searchable, organized library with reading progress, so saved links get read instead of forgotten.

## Features

### Save & organize
- Add, edit and delete resources with validation and **duplicate-URL detection**
- **Auto-detection** of domain, favicon, title and resource type from the URL
- **Smart Categorize**: a local keyword engine suggests a category, type and tags
- Categories, tags and **collections** (with per-collection progress stats)
- Personal notes on every resource

### Find & browse
- Search across title, URL, description, category, tags, notes and type
- Filters and **7 sort options**
- Grid and list views with a details popup
- Favorites page and an Archived section

### Track progress
- Status workflow: **To Read → In Progress → Completed**
- Dashboard with stats, recently added, recently viewed and **"You May Also Like"**
- Analytics: category donut, type bar chart, weekly line chart, status donut

### Everything else
- JSON / CSV export and JSON import
- Light and dark mode
- Responsive layout with a bottom navigation bar on mobile

## Screenshots

### Main Dashboard

<table>
  <tr>
    <th>Light Mode</th>
    <th>Dark Mode</th>
  </tr>
  <tr>
    <td><img src="./screenshot/dashboard-light.png" alt="Main Dashboard - Light Mode" width="100%"></td>
    <td><img src="./screenshot/dashboard-dark.png" alt="Main Dashboard - Dark Mode" width="100%"></td>
  </tr>
</table>

### Analytics Dashboard

<table>
  <tr>
    <th>Light Mode</th>
    <th>Dark Mode</th>
  </tr>
  <tr>
    <td><img src="./screenshot/analytics-light.png" alt="Analytics Dashboard - Light Mode" width="100%"></td>
    <td><img src="./screenshot/analytics-dark.png" alt="Analytics Dashboard - Dark Mode" width="100%"></td>
  </tr>
</table>

## Quick Start

**Prerequisite:** [Node.js 18+](https://nodejs.org/en/download)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:5173**.

> **Windows shortcut:** double-click `install.bat` to install, then `run.bat` to start the app.

### Available scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Starts the dev server with hot reload     |
| `npm run build`   | Creates a production build in `/dist`     |

## Tech Stack

| Area      | Choice                                  |
| --------- | --------------------------------------- |
| UI        | React 18                                |
| Build     | Vite                                    |
| Routing   | React Router (`HashRouter`)             |
| Styling   | Tailwind CSS v4                         |
| Charts    | Recharts                                |
| Icons     | Lucide React                            |
| Storage   | Browser `localStorage`                  |

## Project Structure

```
src/
├── components/   Layout, ResourceCard, ResourceList, ResourceForm, Modal,
│                 ConfirmDialog, EmptyState, StatsCard, TagBadge, ResourceChart
├── pages/        Dashboard, Resources (also Favorites), Collections,
│                 Analytics, SettingsPage
├── hooks/        useLibrary.jsx  → all state + actions (React Context)
├── services/     metadataService.js, smartCategorize.js
│                 (designed to be swapped for real APIs later)
├── utils/        constants, resource (data shape), storage (localStorage),
│                 stats (math)
└── data/         sampleData.js   → demo data
```

## How It Works

`LibraryProvider` (in `useLibrary.jsx`) holds `resources` and `collections`. Pages read them with the `useLibrary()` hook and call actions such as `saveResource`. Every change updates state, which re-renders the UI and charts, and is auto-saved to localStorage.

```
Page / Component ──► useLibrary() action ──► state update ──► UI + charts re-render
                                                  │
                                                  └──► storage.js ──► localStorage
```

## Smart Categorization

`services/smartCategorize.js` scores each category by how many of its keywords appear in the resource's title, URL, description and notes. It then:

1. Picks the highest-scoring category
2. Detects the resource type from the URL and wording
3. Suggests relevant tags

The function is `async`, so it can be replaced with an LLM API call without changing the form that uses it.

## Data Storage & Backup

- All data lives in your browser's `localStorage` under the key `rm_data_v1`. Nothing is sent to a server.
- `utils/storage.js` is the **only** file that touches `localStorage`. To move to a database, replace it with API calls.
- If stored data is corrupted, the app falls back to the demo data.
- Clearing browser data erases your library, so **use Export (JSON/CSV) from Settings for backups**, and JSON import to restore.

## Roadmap

**Planned improvements**
- [ ] Backend API and authentication (Supabase or Express + PostgreSQL)
- [ ] Server-side page-title fetching
- [ ] CSV import
- [ ] Browser extension for one-click saving
- [ ] Automated tests
- [ ] Tag management page

**Planned AI features**
- [ ] Summarizer
- [ ] AI tag generator
- [ ] Semantic duplicate detection
- [ ] Recommendation engine
- [ ] Study roadmap
- [ ] Natural-language search

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit with clear messages
4. Push and open a pull request

## License

Released under the MIT License. See [`LICENSE`](./LICENSE).
