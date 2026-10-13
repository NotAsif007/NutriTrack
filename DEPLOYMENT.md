# NutriTrack deployment

NutriTrack is configured for a Render Blueprint deployment through [`render.yaml`](./render.yaml).

## Services created

- **`nutritrack-api`** — Node/Express API with `/api/v1/health` as the health check.
- **`nutritrack-web`** — Vite/React static site with SPA fallback routing. Render injects the API hostname into `VITE_API_HOST` during the build.
- **GitHub Actions health check** — the free `.github/workflows/health-check.yml` workflow runs hourly (`0 * * * *`) and calls the API health endpoint.

## Deploy

1. In Render, choose **New > Blueprint** and select the `NotAsif007/NutriTrack` repository.
2. Render will read `render.yaml` and create the three services.
3. When prompted for the API service's `MONGODB_URI`, provide a MongoDB Atlas connection string.
4. Render generates `JWT_SECRET`; do not replace it with a value committed to Git.
5. Verify the web service and API service URLs, then open the web service URL.

The health-check workflow requires a repository variable named `NUTRITRACK_API_URL`, set to the deployed API origin such as `https://nutritrack-api.onrender.com`. It runs once every hour and is intentionally read-only: it only requests `/api/v1/health`.

## Production notes

- The API enables `Secure` + `SameSite=None` HttpOnly cookies in production because the frontend and backend are separate HTTPS origins.
- CORS is restricted to the Render web service hostname via `CLIENT_ORIGIN`.
- For a custom frontend domain, update `CLIENT_ORIGIN` in Render to the exact origin, including `https://` and excluding a trailing slash.
- `netlify.toml` is included as a portable static frontend fallback, but the full-stack Render Blueprint is the primary deployment path.
