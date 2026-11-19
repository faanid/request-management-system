# Quality Assurance Checklist

## Automated checks

The GitHub Actions workflow runs on pushes to the working branches and pull requests to `main`.

- [x] TypeScript type-check
- [x] Vite production build
- [x] Mock API Python syntax check
- [x] API health and statistics smoke tests
- [x] API list, search, and detail smoke tests
- [x] API create and update smoke tests
- [x] Validation response check
- [x] Version-conflict response check
- [x] Simulated 503 response and rollback data check

## Manual browser checks

Run the frontend and Mock API locally before final submission.

| Area | Check |
| --- | --- |
| Desktop | Dashboard and request list at 1440 px |
| Tablet | Navigation and request list at 768 px |
| Mobile | Dashboard, request cards, and form at 360 px |
| Navigation | Dashboard, list, details, create, and edit routes |
| Search | Search by title and requester; clear the query |
| Filters | Combine status and priority filters |
| Pagination | Move between pages while preserving active filters |
| Create | Submit valid data and verify it appears in the list |
| Validation | Check title, description, and requester boundaries |
| Edit | Update a request and verify the new version |
| Status | Change status from list and details |
| Conflict | Submit an outdated expected version and reload current data |
| Service failure | Verify a failed status update restores the previous value |
| Empty state | Search for a value with no matching requests |
| API unavailable | Stop the API and verify a clear error state |
| Keyboard | Navigate actions and form controls with the keyboard |

## Assessment dimensions

- Functional correctness and API integration
- Responsive RTL behavior
- Visual hierarchy and consistency
- Form validation and feedback
- Loading, empty, error, and conflict handling
- Accessibility and keyboard usability
- Maintainable feature-based structure
