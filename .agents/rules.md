# Project Rules

- **Backend (Python/FastAPI)**  
  - Use Pydantic models for all request/response schemas.  
  - All endpoints must be in `server/app/api/v1/`.  
  - Every endpoint must return a JSON with `status` and optional `request_id`.  
  - Database models use SQLAlchemy; raw SQL is not allowed.  
  - Celery tasks are defined in `server/app/workers/`.  
  - Use environment variables for configuration (via `pydantic.BaseSettings`).  
  - Log all errors using the `logging` module; no `print()`.  

- **Frontend (Next.js/React)**  
  - Use TypeScript.  
  - All API calls go through `client/src/lib/api.ts`.  
  - Use React hooks; avoid class components.  
  - All text must be internationalized (i18n).  
  - Follow the existing folder structure: `components/`, `pages/`, `styles/`.  

- **General**  
  - Never commit secrets. Use `.env` files.  
  - Write unit tests for all new functionality.  
  - Document public functions with docstrings.  
  - Run `make lint` and `make test` before committing.  