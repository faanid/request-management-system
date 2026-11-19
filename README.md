# Request Management System

A responsive RTL web application for managing organizational requests. The project covers request creation, listing, filtering, details, and editing, with a Persian-first interface.

## Scope

The application is being developed against the REST API supplied with the assessment. Request data and dashboard statistics are read from the API; the frontend does not use hardcoded records as its source of truth.

The planned interface includes:

- Dashboard statistics for total, new, in-progress, and completed requests
- Request listing with search, status and priority filters, and pagination
- Request details, creation, and editing
- Persian language support and right-to-left layout
- Responsive layouts for mobile, tablet, and desktop
- Loading, empty, success, validation, and API error states

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form and Zod
- Lucide React

The package versions and scripts will be recorded in `package.json` and the lockfile.

## API

The assessment includes a local FastAPI mock service. Its base URL is:

```text
http://127.0.0.1:8000
```

The frontend uses the following endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/stats` | Dashboard statistics |
| GET | `/api/requests` | Request list, search, filters, and pagination |
| GET | `/api/requests/{id}` | Request details |
| POST | `/api/requests` | Create a request |
| PATCH | `/api/requests/{id}` | Update a request |

The optional concurrency flow uses the API's `version` and `expected_version` fields to detect conflicting updates.

The mock API has no authentication and is intended for local assessment use. It should not be exposed publicly without appropriate access controls.

## Getting started

Setup instructions will be added once the frontend and local API structure are in place.

## Project status

The repository is being set up. Features listed above describe the project scope and are not a claim that implementation is complete.
