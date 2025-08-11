## 📌 Rudderstack Playwright Cucumber Framework

### **Overview**
This is a Playwright automation framework using **Cucumber (BDD)** for testing Rudderstack flows.  
The framework includes:
- **Playwright** for browser automation & API testing  
- **Cucumber** for BDD-style test execution  
- Page Object Model (POM) structure for maintainability  
- **GitHub Actions** CI pipeline

---

### **📂 Project Structure**
rudderstack-playwright/
│
├── src/
│ ├── features/ # Cucumber feature files
│ ├── steps/ # Step definitions
│ ├── pages/ # Page Object Model classes
│ ├── utils/ # API helpers & utilities
│
├── package.json
├── playwright.config.ts
├── README.md

---

### **⚙️ Installation**
1. **Clone the repository**  
   git clone git@github.com:tiwarikratika05/rudderstack-playwright.git
   cd rudderstack-playwright
Install dependencies
npm install

Create a .env file with your credentials:
BASE_URL=https://example.com
EMAIL=your_email@example.com
PASSWORD=your_password

▶️ Running Tests
Run all tests:
npm run test
Run tests with UI mode:
npx cucumber-js --require-module ts-node/register --require src/steps/**/*.ts --publish

