# 🚀 MERN/Backend Job Hunter Bot

An automated job search engine that scrapes job boards for Frontend, Backend, and MERN stack roles and sends instant alerts via Telegram. 

**Running 24/7 on GitHub Actions.**

---

## 🛠 Features
* **Zero-Footprint:** Runs entirely on GitHub Actions (no laptop space used).
* **Smart Filtering:** Only notifies you if specific keywords (Node, React, etc.) are found.
* **Database Tracking:** Uses MongoDB Atlas to ensure you never get the same job alert twice.
* **Instant Alerts:** Real-time notifications via Telegram Bot API.

---

## ⚙️ How to Update Keywords
If you want to search for new roles (e.g., "Full Stack" or "DevOps") or add new tech stack requirements:

1. Go to your GitHub Repository.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Edit the following secrets:
   - `SEARCH_ROLES`: Add titles separated by commas (e.g., `MERN, Backend, Fullstack`).
   - `KEYWORDS`: Add specific tech (e.g., `redux, tailwind, aws`).
4. The bot will automatically use these new settings during its next scheduled run.

---

## 📂 Folder Structure
- `src/index.js`: The orchestrator that runs the search and logic.
- `src/scrapers/`: Contains the scraping logic for different job boards.
- `src/models/`: Mongoose schema for MongoDB.
- `src/services/`: Telegram notification logic.
- `.github/workflows/`: The automation schedule (CRON).

---

## 🚀 Deployment Checklist
- [x] Create Telegram Bot via @BotFather.
- [x] Get Chat ID via @userinfobot.
- [x] Set up MongoDB Atlas (Free Tier).
- [x] Add all tokens to GitHub Secrets.
- [x] Push code to `main` branch.

---
*Created by [Your Name]*