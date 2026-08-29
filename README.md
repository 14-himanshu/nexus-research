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

You can run Nexus Research either using **Docker** (recommended) or manually.

### Prerequisites
- API Keys: 
  - [Google Gemini API Key](https://aistudio.google.com/app/apikey)
  - [Tavily Search API Key](https://tavily.com/)

### Method 1: Using Docker (Recommended)
Make sure you have [Docker](https://docs.docker.com/get-docker/) installed. This method spins up both the frontend and backend in a single command.

```bash
# Set up backend environment variables
cp backend/.env.example backend/.env

# Add your API keys and a DATABASE_URL to backend/.env
# If you don't have a database, the docker-compose defaults to a local dev setup.

# Start the application
docker-compose up --build
```
- **Frontend App**: `http://localhost:80`
- **Backend API**: `http://localhost:8000`

### Method 2: Manual Setup

#### 1. Backend Setup (AI Engine)
Requires Python 3.9+

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```
Edit the `.env` file and add your API keys. Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup (Web App)
Requires Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

Nexus Research is fully configured for professional deployment. To ensure your deployed app doesn't throw a "Failed to fetch" error, follow these steps exactly:

1. **Database (Neon/Supabase)**: Create a free serverless Postgres database and copy the connection string.
2. **Frontend (Vercel)**: Import the `frontend` directory to Vercel. 
   - You **MUST** add the `VITE_BACKEND_URL` environment variable pointing to your deployed backend URL (e.g., `https://my-backend.onrender.com`).
3. **Backend (Render)**: Use the provided `render.yaml` Blueprint to automatically provision the backend service.
   - You **MUST** add `FRONTEND_URL` in the Render dashboard and set it to your exact Vercel frontend URL (e.g., `https://my-frontend.vercel.app`). If this doesn't match, CORS will block requests.
   - Make sure to add all other environment variables (API keys, `DATABASE_URL`) in the Render dashboard.

## 🧪 Testing

The backend includes a professional test suite using `pytest`.

```bash
cd backend
pytest
```

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
