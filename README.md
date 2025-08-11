# Rudderstack Playwright + Cucumber Framework

This repository contains an **end-to-end automation framework** for testing Rudderstack flows using **Playwright** with **Cucumber (BDD)**.  
The framework automates login, navigation to the Connections page, fetching Data Plane URL and Write Key, sending API events, and verifying event counts from the UI.

---

## 📂 Project Structure

.
├── src/
│ ├── features/ # BDD feature files
│ ├── pages/ # Page Object Model classes
│ ├── steps/ # Step definitions linked to features
│ ├── support/ # Custom World, hooks, utilities
│ ├── utils/ # API helper functions
│ └── ...
├── package.json
└── .github/workflows/ci.yml # GitHub Actions CI workflow

---

## 🚀 How to Run Locally

### 1️⃣ Install dependencies
npm install

2️⃣ Set environment variables
Create a .env file in the project root:
BASE_URL=https://app.rudderstack.com
EMAIL=your_email@example.com
PASSWORD=your_password

3️⃣ Run tests
npm run test
This will run Playwright + Cucumber tests in headed mode by default (update in script if needed).
