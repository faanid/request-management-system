# Request Management System

A responsive RTL web application for managing organizational requests. The project covers request creation, listing, filtering, details, and editing, with a Persian-first interface.

## Scope

The application uses the REST API supplied with the assessment. Request data and dashboard statistics are read from the API; the frontend does not use hardcoded records as its source of truth.

The interface includes:

- Dashboard statistics for total, new, in-progress, and completed requests
- Request listing with search, status and priority filters, and pagination
- Request details, creation, and editing
- Persian language support and right-to-left layout
- Responsive layouts for mobile, tablet, and desktop
- Loading, empty, success, validation, and API error states

## Tech stack

- React 19
- TypeScript 7
- Vite 8
- Tailwind CSS 4
- React Router 8
- TanStack Query 5
- React Hook Form and Zod
- Lucide React

Versions are pinned in `package.json`. The project requires Node.js 20.19 or newer supported releases.

## Getting started

Install the frontend dependencies:

```bash
npm install
```

The frontend defaults to the local Mock API at `http://127.0.0.1:8000`. No frontend environment file is required for local development.

Start the frontend:

```bash
npm run dev
```

The development server uses `http://localhost:5173` by default.

## Mock API

The assessment's FastAPI service is included in `mock-api`. It uses a local SQLite database and seeds 16 sample requests on first startup.

Run it with Docker if Docker is installed and its engine is running:

```bash
docker compose up --build
```

Alternatively, run it locally with Python 3.10 or newer. From the repository root, use Git Bash:

```bash
cd mock-api
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv/Scripts/python.exe -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open while using the frontend. The API starts at `http://127.0.0.1:8000`; verify it at `/api/health` and open its interactive documentation at `/docs`.

If you use PowerShell instead of Git Bash, the equivalent environment Python path is `.\.venv\Scripts\python.exe`.

The API is available at `http://127.0.0.1:8000` and its interactive documentation is at `http://127.0.0.1:8000/docs`.

To reset the sample database, stop the API and run `python reset_data.py` from the `mock-api` directory.

## API

The frontend uses the following endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/requests` | Request list, search, filters, and pagination |
| GET | `/api/requests/{id}` | Request details |
| POST | `/api/requests` | Create a request |
| PATCH | `/api/requests/{id}` | Update a request |

The optional concurrency flow uses the API's `version` and `expected_version` fields to detect conflicting updates. The mock service also supports a deterministic 503 response for testing optimistic update rollback.

The mock API has no authentication and is intended for local assessment use. It should not be exposed publicly without appropriate access controls.

## Quality checks

```bash
npm run typecheck
npm run build
```

The GitHub Actions workflow also runs frontend type-check/build validation and Mock API smoke tests.

## Implementation

The repository includes the React application, API-connected request workflows, local FastAPI Mock API, responsive RTL layouts, and automated CI checks. The editable Figma design file is a separate assessment deliverable.
