# 🚀 AI Career Copilot — Smart ATS Resume Analyzer & Career Coach

![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Serverless-black?logo=vercel)
![Google Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20API-4285F4?logo=google)
![JavaScript](https://img.shields.io/badge/Frontend-Vanilla%20JS%20%7C%20HTML5%20%7C%20CSS3-F7DF1E?logo=javascript)
![Security](https://img.shields.io/badge/Security-Zero--Leak%20API%20Architecture-10B981)
![Tests](https://img.shields.io/badge/Tests-9%2F9%20Passing-brightgreen)

**AI Career Copilot** is a modern, responsive, and secure web application designed to help job seekers, college students, and internship applicants bridge the gap between their resumes and target job postings. 

Powered by **Google Gemini AI** and deployed on **Vercel Serverless Functions**, it analyzes resume content against real-world job descriptions, calculates an objective **ATS Match Score (0–100)**, identifies **missing technical keywords with recruiter context**, and delivers **personalized, student-friendly career coaching advice** without hallucinating qualifications.

---

## 🌟 Key Features

- **🎯 ATS Match Scorecard**: Visual animated SVG circular gauge displaying a 0–100 compatibility score with categorized match badges (*Exceptional, Strong, Moderate, Needs Optimization*).
- **🔍 Intelligent Keyword & Skill Matrix**:
  - **Matched Skills**: Highlights competencies present in both resume and job description.
  - **Missing Technical Keywords**: Flags missing keywords with importance ratings (*High, Medium, Recommended*) and explains *why* recruiters and ATS filters prioritize them.
- **🎓 Student & Internship Friendly Coaching**:
  - Dedicated action plan tailored for college students, freshers, and early-career changers.
  - Practical suggestions on framing academic capstone projects, lab work, and demo projects without fabricating credentials.
- **🌟 Deep Diagnostic Insights**:
  - Highlights clear resume strengths backed by evidence.
  - Pinpoints specific areas needing improvement (e.g., quantifiable metrics, clarity).
  - Evaluates project depth and relevant experience alignment.
- **⚡ Interactive Workspace**:
  - Real-time word and character counters.
  - 1-Click pre-filled samples (*Tech Internship* and *Junior Backend Developer*).
  - Clipboard paste helpers and instant reset.
  - Keyboard shortcut: `Ctrl + Enter` (or `Cmd + Enter`) to trigger analysis.
- **📋 Export & Sharing**:
  - One-click markdown report copy to clipboard with toast feedback.
  - Dedicated print stylesheet (`Ctrl + P`) for saving clean, professional PDF reports.
- **🔒 Zero-Leak Security Architecture**:
  - The Gemini API key is **never exposed** in client-side HTML, CSS, or JavaScript.
  - All communication routes through a server-side Vercel Serverless Function (`/api/analyze`) reading `GEMINI_API_KEY` from secure environment variables.
- **📱 Fully Responsive Design**:
  - Custom CSS Grid and Flexbox design system optimized for mobile phones, tablets, and desktop displays.

---

## 📐 System Architecture & Security

```
[ Browser / Frontend Client ]
       │
       │  POST /api/analyze  (No API keys in client!)
       ▼
[ Vercel Serverless Function (Node.js) ]
       │
       │  Reads process.env.GEMINI_API_KEY securely
       │  Validates inputs & enforces length thresholds
       │  Applies Structured Role-Based Prompt
       ▼
[ Google Gemini Generative AI API ]
       │
       │  Returns structured JSON analysis
       ▼
[ Vercel Serverless Function (Node.js) ]
       │
       │  Normalizes & sanitizes JSON payload
       ▼
[ Browser / Frontend Client ]
       │
       ▼
Renders ATS Scorecard, Skill Matrix, & Actionable Roadmap
```

### Security Highlights
1. **No Client-Side Secrets**: Neither `index.html` nor `js/app.js` contains API keys, tokens, or credentials.
2. **Environment Variable Protection**: `.env` and `.env.local` are strictly excluded in `.gitignore`.
3. **Payload & Method Validation**: The serverless endpoint rejects non-POST methods (`405 Method Not Allowed`) and sanitizes malformed or undersized inputs (`400 Bad Request`).
4. **Resilient Fallback**: Gracefully falls back across Gemini models (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`) and maps errors into human-readable advice.

---

## 🧠 Structured Role-Based Prompt Engineering

The core intelligence is driven by a specialized role prompt developed through prompt engineering:

- **Role Persona**: Senior Technical Recruiter, ATS Algorithm Specialist, and University Career Coach with 12+ years of experience in early-career tech hiring.
- **Integrity Rule**: Strict prohibition against inventing skills, qualifications, or experience.
- **Structure**: Enforces strict JSON output with defined fields:
  - `ats_score`: Quantitative rating (0-100).
  - `match_tier`: Qualitative bracket.
  - `summary`: Holistic executive assessment.
  - `matching_skills`: Array of shared skills.
  - `missing_keywords`: Objects containing `keyword`, `importance`, and `reason`.
  - `relevant_experience_assessment`: Evaluation of projects and practical experience.
  - `strengths`: Evidenced candidate positives.
  - `areas_for_improvement`: Actionable constructive critiques.
  - `actionable_suggestions`: Realistic roadmap for students to close skill gaps.

---

## 📁 Project Directory Structure

```
Resume analyser/
├── .env.example          # Safe template for environment variables
├── .gitignore            # Excludes secrets, node_modules, and build caches
├── package.json          # Node.js configuration, dev scripts, test scripts
├── vercel.json           # Vercel deployment headers and routing rules
├── index.html            # Semantic, modern, accessible single-page interface
├── css/
│   └── styles.css        # Responsive design system & print stylesheet
├── js/
│   ├── app.js            # UI controller, input validation, and results renderer
│   └── samples.js        # High-quality sample resumes & job descriptions
├── api/
│   └── analyze.js        # Vercel Serverless Function communicating with Gemini
├── server.js             # Built-in zero-dependency local development server
├── test/
│   └── test-cases.js     # Automated edge-case verification test suite
└── README.md             # Complete project documentation and guides
```

---

## 💻 Local Installation & Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher; v20+ recommended)
- A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Step 1: Clone or Navigate to the Project
```bash
cd "c:\Users\ModharapalemChandana\Downloads\Resume analyser"
```

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```bash
# Windows PowerShell:
Copy-Item .env.example .env
```
Open `.env` in your text editor and paste your Gemini API key:
```env
GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyHere
```

### Step 3: Start the Local Development Server
```bash
npm start
```
*Note: The built-in server uses Node.js native `http` and `fs` modules with zero external dependencies!*

### Step 4: Open in Your Browser
Visit `http://localhost:3000` to interact with the application.

### Step 5: Run Automated Verification Tests
```bash
npm test
```

---

## 🧪 Edge-Case Verification Matrix

The test suite (`test/test-cases.js`) confirms all 6 required application states:

| # | Scenario / Edge Case | Expected Behavior | Verification Status |
|---|---|---|---|
| 1 | **Resume & job description both empty** | Returns `400 Missing Input`, displays warning banner | ✅ PASSED |
| 2 | **Resume entered, job description empty** | Returns `400 Missing Job Description`, prompts for job text | ✅ PASSED |
| 3 | **Job description entered, resume empty** | Returns `400 Missing Resume`, prompts for resume text | ✅ PASSED |
| 4A | **Server missing GEMINI_API_KEY** | Returns `500 Server Configuration Error`, guides configuration | ✅ PASSED |
| 4B | **Gemini API rate limit exceeded** | Returns `502 Gemini API Error` with 60-second retry guidance | ✅ PASSED |
| 4C | **Invalid Gemini API key** | Returns `502 Gemini API Error` with key renewal instructions | ✅ PASSED |
| 5 | **Resume or job description too short (< 50 chars)** | Returns `400 Resume Too Short`, enforces quality standard | ✅ PASSED |
| 6 | **Valid resume & job description submitted** | Returns `200 OK` with complete scorecard, skills, & roadmap | ✅ PASSED |
| 7 | **Security: Unauthorized HTTP method (GET)** | Returns `405 Method Not Allowed` | ✅ PASSED |

---

## 🌐 Step-by-Step GitHub Upload Guide

Follow these beginner-friendly instructions to upload your project to GitHub securely:

### Option A: Using the GitHub Website (Easiest for Beginners)
1. Go to [github.com](https://github.com) and log in.
2. In the top-right corner, click **+** and select **New repository**.
3. Name your repository (e.g. `ai-career-copilot`).
4. Set visibility to **Public** (or **Private**).
5. **Do not** check "Add a README file" (we already created a complete one).
6. Click **Create repository**.
7. On the repository page, click **"uploading an existing file"**.
8. Drag and drop all files from your project folder **EXCEPT `.env`**:
   - `index.html`
   - `package.json`
   - `vercel.json`
   - `.gitignore`
   - `.env.example`
   - `README.md`
   - `server.js`
   - `api/` folder
   - `css/` folder
   - `js/` folder
   - `test/` folder
9. Type a commit message (e.g. *"Initial release: AI Career Copilot v2.0"*) and click **Commit changes**.

### Option B: Using Git Command Line
```bash
# Initialize git repository
git init

# Stage all files (git will automatically ignore .env due to .gitignore)
git add .

# Confirm .env is NOT staged
git status

# Commit changes
git commit -m "feat: complete AI Career Copilot with Vercel serverless backend"

# Set default branch to main
git branch -M main

# Link to your remote GitHub repository
git remote add origin https://github.com/<your-username>/ai-career-copilot.git

# Push to GitHub
git push -u origin main
```

> [!IMPORTANT]
> Always verify that your `.env` file containing your real secret key is **never** uploaded to GitHub. Your `.gitignore` is already configured to protect you.

---

## ☁️ Step-by-Step Vercel Deployment Guide

Deploying your project to Vercel takes less than 3 minutes:

### Step 1: Sign In to Vercel
1. Visit [vercel.com](https://vercel.com) and click **Sign Up** or **Log In**.
2. Sign in with your **GitHub account** to enable seamless repository synchronization.

### Step 2: Import Your Repository
1. On your Vercel Dashboard, click **"Add New..."** in the top right and select **Project**.
2. In the list of GitHub repositories, find `ai-career-copilot` and click **Import**.

### Step 3: Configure Project Settings
1. **Project Name**: Keep as `ai-career-copilot` or customize as desired.
2. **Framework Preset**: Select **Other** (since this is a standard HTML/JS project with a serverless `api/` folder).
3. **Root Directory**: Leave as `./` (default).

### Step 4: Add GEMINI_API_KEY Environment Variable
1. Expand the **Environment Variables** accordion section.
2. Add the following entry:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *Paste your real Google Gemini API key* (e.g. `AIzaSy...`)
3. Ensure **Production**, **Preview**, and **Development** checkboxes are all checked.
4. Click **Add**.

### Step 5: Deploy
1. Click the blue **Deploy** button.
2. Vercel will build your static files and deploy `api/analyze.js` as an auto-scaling serverless function.
3. Within 30 seconds, you will see confetti and a preview of your live application!

### Step 6: Test Your Live URL
1. Click the provided domain URL (e.g. `https://ai-career-copilot-xyz.vercel.app`).
2. Click the **"👨‍💻 Tech Internship Sample"** button to load sample data.
3. Click **"🚀 Analyze Resume Match"**.
4. Confirm that the ATS score, skill matrix, and personalized suggestions render correctly.

---

## 🔧 Troubleshooting & Common Errors

| Issue | Root Cause | Solution |
|---|---|---|
| **500 Server Configuration Error** | `GEMINI_API_KEY` is missing in Vercel. | In Vercel, navigate to **Project Settings → Environment Variables**, add `GEMINI_API_KEY`, and trigger a redeployment under the **Deployments** tab. |
| **502 Gemini API Error (Rate Limit)** | Free tier Gemini API hit rate limit. | Wait 60 seconds before resubmitting. For higher throughput, verify your Google AI Studio tier. |
| **502 Gemini API Error (API Key Invalid)** | Key expired or copied with whitespace. | Re-generate your key at [aistudio.google.com](https://aistudio.google.com) and ensure no leading/trailing spaces exist. |
| **404 Not Found on `/api/analyze`** | File not located inside `api/` directory. | Ensure `analyze.js` is placed inside the root `api/` folder (`api/analyze.js`). |
| **Content Too Short Alert** | Inputs under 50 characters. | Ensure you paste the full text of both your resume and the job description. |

---

## 🤖 AI Usage Disclosure

As part of academic and technical transparency:
- **ChatGPT & LLM Tools**: Utilized for refining prompt engineering techniques (Structured Role-Based Prompting), defining edge-case test matrix scenarios, optimizing UI accessibility, and drafting technical documentation.
- **Google Gemini API (`gemini-2.5-flash`)**: Powers the production resume analysis, ATS compatibility scoring, and personalized career coaching feedback.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
