# 🏥 SmartQueue - AI Hospital Queue & Appointment System

SmartQueue is an AI-powered hospital appointment booking and patient queue management platform. It features an intelligent clinical triage assistant, multi-model AI failover (OpenRouter & Google Gemini), automated confirmation emails, and doctor schedule tracking.

---

## ✨ Key Features

- 🤖 **AI Clinical Assistant**: Symptom analysis and specialist doctor recommendations.
- 🔄 **AI Key Rotation & Failover**: Primary AI (OpenRouter) with automatic fallback to Google Gemini.
- 📋 **Live Queue Tracking**: Real-time token generation (`SQ-XXXXXX`) and estimated waiting time.
- 📧 **Automated Confirmations**: Integrated with Google Apps Script to send patient emails and doctor schedule updates.
- 🚀 **Vercel Ready**: Full-stack Serverless architecture ready to deploy in 1-click.

---

## 🚀 Quick Start (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dakshgoyal1812/miniproject.git
   cd miniproject
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your keys in `.env`:
   ```env
   PORT=8080
   OPENROUTER_API_KEY=your_openrouter_key
   GOOGLE_API_KEY=your_gemini_key
   APPS_SCRIPT_URL=your_google_apps_script_url
   ```

3. **Start the local server:**
   ```bash
   npm start
   ```
   Open `http://localhost:8080` in your browser.

---

## ☁️ Deployment on Vercel

1. Import this repository in [Vercel](https://vercel.com/new).
2. Go to **Settings** ➔ **Environment Variables** and add:
   - `OPENROUTER_API_KEY`
   - `GOOGLE_API_KEY`
   - `APPS_SCRIPT_URL`
3. Click **Deploy**!

---

## 🔒 Security Note
Never commit the `.env` file to version control. Keep all secret API keys configured in `.env` locally or in the Vercel Environment Variables dashboard.