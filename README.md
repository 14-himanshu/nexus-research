<div align="center">
  <div style="background: white; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; color: black; margin: 0 auto 20px;">
    N
  </div>
  <h1>Nexus Research</h1>
  <p><strong>Fully autonomous, multi-agent deep research powered by LangGraph & Google Gemini.</strong></p>
</div>

<br />

Nexus Research is an enterprise-grade AI research assistant that doesn't just answer questions—it executes a complete research pipeline. Give it a topic, and a specialized team of AI agents (Planner, Researcher, Fact-Checker, and Writer) will scour the web, cross-reference facts, and synthesize a comprehensive, beautifully formatted report.

## ✨ Features

- **Multi-Agent Architecture**: A graph-based pipeline where agents collaborate, review each other's work, and iteratively build reports.
- **Deep Web Search**: Real-time web scraping and search integration (Tavily).
- **Private Workspaces**: Multi-user authentication ensures your research history remains completely private.
- **Bring Your Own Key (BYOK)**: Connect your personal Google Gemini API key to avoid global rate limits.
- **Paper Mode**: A distraction-free reading mode optimized for long-form reports.
- **Rich Exports**: One-click copy to Markdown or print to PDF.

## 🛠️ Tech Stack

- **Backend AI Engine**: Python, FastAPI, LangGraph, LangChain, Google Gemini 1.5 Pro.
- **Database**: PostgreSQL (via `psycopg2`) for scalable, production-grade storage.
- **Frontend**: React (Vite), TypeScript, TailwindCSS, Framer Motion for beautiful micro-animations.
- **DevOps**: Docker, GitHub Actions CI, Vercel (Frontend), Render (Backend).

---

## 🚀 Getting Started

Follow these instructions to run Nexus Research locally on your machine.

### Prerequisites
- Python 3.9+
- Node.js 18+
- API Keys: 
  - [Google Gemini API Key](https://aistudio.google.com/app/apikey)
  - [Tavily Search API Key](https://tavily.com/)

### 1. Backend Setup (AI Engine)
The backend handles the LangGraph pipeline, database, and authentication.

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```
Edit the `.env` file and add your API keys:
- `GROQ_API_KEY` (or `GEMINI_API_KEY`)
- `TAVILY_API_KEY`
- `DATABASE_URL` (e.g. your Neon or Supabase connection string)

Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```
*The backend will run on `http://localhost:8000`.*

### 2. Frontend Setup (Web App)
The frontend is a beautiful, dark-mode React application.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will run on `http://localhost:5173`. Open this URL in your browser.*

---

## ☁️ Deployment

Nexus Research is fully configured for professional, free-tier deployment using a standard DevOps pipeline.

1. **Frontend (Vercel)**: Import the repository to Vercel. Add `VITE_BACKEND_URL` pointing to your deployed backend URL.
2. **Backend (Render)**: Use the provided `render.yaml` Blueprint to automatically provision the backend service. Make sure to add all environment variables (API keys, `DATABASE_URL`) in the Render dashboard.
3. **Database (Neon/Supabase)**: Create a free serverless Postgres database and copy the connection string.
4. **CI/CD**: The included `.github/workflows/ci.yml` will automatically verify your frontend types and backend linting on every push to `main`.

---

## 🧠 How it Works

Nexus Research uses a state-machine architecture powered by **LangGraph**. When you submit a query, the state flows through these specialized nodes:

1. **Planner Agent**: Analyzes your request and generates a step-by-step research plan, identifying exactly what information needs to be gathered.
2. **Researcher Agent**: Executes the plan by running targeted web searches, reading web pages, and accumulating raw data into the graph state.
3. **Fact-Checker Agent**: Reviews the accumulated data against the original query. It verifies claims, highlights discrepancies, and identifies if more research is needed. (If more data is needed, the graph loops back to the Researcher).
4. **Writer Agent**: Takes the verified facts and synthesizes them into a cohesive, structured markdown report with citations.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
