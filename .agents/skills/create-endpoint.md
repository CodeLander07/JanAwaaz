# Skill: Create FastAPI Endpoint

## Description
Generate a new API endpoint for CivicPulse backend.

## Inputs
- `method`: HTTP method (GET, POST, etc.)
- `path`: URL path (e.g., `/api/v1/hotspots`)
- `request_schema`: Pydantic model name (optional)
- `response_schema`: Pydantic model name
- `description`: What the endpoint does

## Steps
1. Create a new file under `backend/app/api/v1/` if needed.
2. Define the endpoint function with appropriate decorators.
3. Use the provided Pydantic schemas for validation.
4. Add error handling and logging.
5. Include unit test in `backend/tests/`.

## Example
```python
@app.get("/api/v1/hotspots")
async def get_hotspots(sector: str, limit: int = 10):
    ...